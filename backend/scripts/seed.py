"""Wipes all posts and seeds a mix of posts/responses/quotes/reposts for
local testing (e.g. exercising infinite scroll with a real dataset).

Usage (from backend/, with the venv/deps used by the app):
    python -m scripts.seed
"""

import asyncio
import random
import sys
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import delete  # noqa: E402

from app.database import async_session  # noqa: E402
from app.models import Post, Reaction  # noqa: E402

TOTAL_POSTS = 200
ROOT_POSTS = 100
RESPONSES = 45
QUOTES = 35
REPOSTS = TOTAL_POSTS - ROOT_POSTS - RESPONSES - QUOTES

CHAMPIONS = [
    "Aatrox", "Ahri", "Akali", "Akshan", "Alistar", "Amumu", "Ashe", "Aurora",
    "Blitzcrank", "Braum", "Caitlyn", "Camille", "Darius", "Diana", "Draven",
    "Ekko", "Evelynn", "Ezreal", "Fiora", "Garen", "Gragas", "Gwen", "Irelia",
    "Jax", "Jhin", "Jinx", "Karthus", "Katarina", "Kayle", "LeeSin", "Leona",
    "Lulu", "Lux", "Malphite", "MasterYi", "MissFortune", "Morgana", "Nami",
    "Nasus", "Nautilus", "Neeko", "Pyke", "Quinn", "Rakan", "Renekton",
    "Riven", "Samira", "Sejuani", "Senna", "Sett", "Shen", "Sona", "Soraka",
    "Syndra", "Talon", "Teemo", "Thresh", "Tristana", "Twitch", "Varus",
    "Vayne", "Veigar", "Vi", "Viego", "Volibear", "Warwick", "Wukong",
    "Xayah", "Xerath", "Yasuo", "Yone", "Yuumi", "Zed", "Zeri", "Ziggs",
    "Zoe", "Zyra",
]

POST_LINES = [
    "gg easy",
    "report jungler pls",
    "flash está en cooldown, siempre",
    "esta build es una obra de arte",
    "1v9 o nada",
    "el meta actual es un chiste",
    "carrying as usual",
    "nerfeen a este campeón ya",
    "top lane es una isla desierta",
    "jamás me van a hacer bajar del pentakill",
    "el objetivo era ganar, no farmear",
    "el enemigo backea, hora de invadir",
    "esa ulti cambió el partido",
    "ward ahí, siempre hay alguien",
    "dragón alma, gg ya",
    "otra vez fed en bot",
    "el balance de este parche es rarísimo",
    "clutch play o feed, no hay término medio",
    "quién dijo que support no hace daño",
    "smurfs everywhere últimamente",
]

RESPONSE_LINES = [
    "totalmente de acuerdo",
    "ni ahí, te equivocás",
    "jajaja literal",
    "esto no envejeció bien",
    "confirmado en la última partida",
    "depende del matchup igual",
    "eso solo pasa en elo bajo",
    "el parche que viene lo arregla",
    "yo lo vengo diciendo hace rato",
    "screenshot esto para el futuro",
]

QUOTE_LINES = [
    "esto necesita más atención",
    "justo lo que estaba pensando",
    "citando para que no se pierda",
    "importante que todos lean esto",
    "no podría estar más de acuerdo",
    "esto merece su propio post",
]


def random_timestamp(start: datetime, end: datetime) -> datetime:
    delta = end - start
    seconds = random.uniform(0, delta.total_seconds())
    return start + timedelta(seconds=seconds)


async def main() -> None:
    now = datetime.now(timezone.utc)
    window_start = now - timedelta(days=3)

    async with async_session() as db:
        await db.execute(delete(Reaction))
        await db.execute(delete(Post))
        await db.commit()

        roots: list[Post] = []
        for _ in range(ROOT_POSTS):
            post = Post(
                id=uuid.uuid4(),
                created_at=random_timestamp(window_start, now),
                champion_id=random.choice(CHAMPIONS),
                content=random.choice(POST_LINES),
            )
            db.add(post)
            roots.append(post)
        await db.commit()

        def derived_timestamp(parent: Post) -> datetime:
            parent_ts = parent.created_at
            if parent_ts.tzinfo is None:
                parent_ts = parent_ts.replace(tzinfo=timezone.utc)
            return random_timestamp(parent_ts, now)

        for _ in range(RESPONSES):
            parent = random.choice(roots)
            db.add(
                Post(
                    id=uuid.uuid4(),
                    created_at=derived_timestamp(parent),
                    champion_id=random.choice(CHAMPIONS),
                    content=random.choice(RESPONSE_LINES),
                    response_of=parent.id,
                )
            )

        for _ in range(QUOTES):
            parent = random.choice(roots)
            db.add(
                Post(
                    id=uuid.uuid4(),
                    created_at=derived_timestamp(parent),
                    champion_id=random.choice(CHAMPIONS),
                    content=random.choice(QUOTE_LINES),
                    quote_of=parent.id,
                )
            )

        for _ in range(REPOSTS):
            parent = random.choice(roots)
            db.add(
                Post(
                    id=uuid.uuid4(),
                    created_at=derived_timestamp(parent),
                    champion_id=random.choice(CHAMPIONS),
                    content="",
                    repost_of=parent.id,
                )
            )

        await db.commit()

    total = ROOT_POSTS + RESPONSES + QUOTES + REPOSTS
    print(
        f"Seeded {total} posts: {ROOT_POSTS} root, {RESPONSES} responses, "
        f"{QUOTES} quotes, {REPOSTS} reposts."
    )


if __name__ == "__main__":
    # psycopg's async driver can't run under Windows' default
    # ProactorEventLoop -- force the selector-based loop instead.
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
