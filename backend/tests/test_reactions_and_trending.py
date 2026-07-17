import pytest


async def _create_post(client, champion_id="ahri", content="hola mundo"):
    r = await client.post(
        "/api/v1/posts", json={"championId": champion_id, "content": content}
    )
    assert r.status_code == 201
    return r.json()


async def test_toggle_reaction_adds_then_removes(client):
    post = await _create_post(client)

    r = await client.post(
        f"/api/v1/posts/{post['id']}/reactions", json={"anonId": "anon-1", "emoji": "⚡"}
    )
    assert r.status_code == 200
    body = r.json()
    assert body["counts"]["⚡"] == 1
    assert body["mine"] == ["⚡"]

    r = await client.post(
        f"/api/v1/posts/{post['id']}/reactions", json={"anonId": "anon-1", "emoji": "⚡"}
    )
    body = r.json()
    assert body["counts"]["⚡"] == 0
    assert body["mine"] == []


async def test_reactions_are_unique_per_anon_id(client):
    post = await _create_post(client)

    await client.post(
        f"/api/v1/posts/{post['id']}/reactions", json={"anonId": "anon-1", "emoji": "🛡️"}
    )
    r = await client.post(
        f"/api/v1/posts/{post['id']}/reactions", json={"anonId": "anon-2", "emoji": "🛡️"}
    )
    assert r.json()["counts"]["🛡️"] == 2
    assert r.json()["mine"] == ["🛡️"]


async def test_different_emojis_can_coexist_for_the_same_anon_id(client):
    post = await _create_post(client)

    await client.post(
        f"/api/v1/posts/{post['id']}/reactions", json={"anonId": "anon-1", "emoji": "⚡"}
    )
    r = await client.post(
        f"/api/v1/posts/{post['id']}/reactions", json={"anonId": "anon-1", "emoji": "💀"}
    )
    assert set(r.json()["mine"]) == {"⚡", "💀"}


async def test_get_reactions_returns_summary_without_mutating(client):
    post = await _create_post(client)
    await client.post(
        f"/api/v1/posts/{post['id']}/reactions", json={"anonId": "anon-1", "emoji": "⚡"}
    )

    r = await client.get(f"/api/v1/posts/{post['id']}/reactions", params={"anonId": "anon-1"})
    assert r.status_code == 200
    assert r.json()["counts"]["⚡"] == 1
    assert r.json()["mine"] == ["⚡"]

    r = await client.get(f"/api/v1/posts/{post['id']}/reactions", params={"anonId": "anon-2"})
    assert r.json()["counts"]["⚡"] == 1
    assert r.json()["mine"] == []


async def test_reaction_rejects_unknown_emoji(client):
    post = await _create_post(client)
    r = await client.post(
        f"/api/v1/posts/{post['id']}/reactions", json={"anonId": "anon-1", "emoji": "🍕"}
    )
    assert r.status_code == 422


async def test_reaction_on_nonexistent_post_returns_404(client):
    r = await client.post(
        "/api/v1/posts/00000000-0000-0000-0000-000000000000/reactions",
        json={"anonId": "anon-1", "emoji": "⚡"},
    )
    assert r.status_code == 404


async def test_trending_orders_by_quotes_plus_reposts(client):
    quiet = await _create_post(client, content="sin engagement")
    popular = await _create_post(client, content="con mucho engagement")

    await client.post(
        f"/api/v1/posts/{popular['id']}/quotes", json={"championId": "zed", "content": "q"}
    )
    await client.post(f"/api/v1/posts/{popular['id']}/reposts", json={"championId": "lux"})

    r = await client.get("/api/v1/posts/trending")
    assert r.status_code == 200
    ids = [p["id"] for p in r.json()["posts"]]
    assert ids[0] == popular["id"]
    assert quiet["id"] in ids


async def test_trending_excludes_responses(client):
    root = await _create_post(client)
    await client.post(
        f"/api/v1/posts/{root['id']}/responses",
        json={"championId": "yasuo", "content": "reply"},
    )

    r = await client.get("/api/v1/posts/trending")
    ids = {p["id"] for p in r.json()["posts"]}
    assert ids == {root["id"]}


async def test_trending_respects_limit(client):
    for i in range(3):
        await _create_post(client, content=f"post {i}")

    r = await client.get("/api/v1/posts/trending", params={"limit": 2})
    assert len(r.json()["posts"]) == 2
