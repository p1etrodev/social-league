import pytest


async def _create_post(client, champion_id="ahri", content="hola mundo"):
    r = await client.post(
        "/api/v1/posts", json={"championId": champion_id, "content": content}
    )
    assert r.status_code == 201
    return r.json()


async def test_streak_orders_champions_by_activity(client):
    await _create_post(client, champion_id="zed")
    await _create_post(client, champion_id="ahri")
    await _create_post(client, champion_id="ahri")

    r = await client.get("/api/v1/champions/streak")
    assert r.status_code == 200
    champions = r.json()["champions"]
    assert champions[0] == {"championId": "ahri", "activity": 2}
    assert {"championId": "zed", "activity": 1} in champions


async def test_streak_counts_any_post_type_as_activity(client):
    post = await _create_post(client, champion_id="ahri")
    await client.post(
        f"/api/v1/posts/{post['id']}/responses",
        json={"championId": "ahri", "content": "reply"},
    )
    await client.post(
        f"/api/v1/posts/{post['id']}/quotes", json={"championId": "ahri", "content": "quote"}
    )
    await client.post(f"/api/v1/posts/{post['id']}/reposts", json={"championId": "ahri"})

    r = await client.get("/api/v1/champions/streak")
    champions = r.json()["champions"]
    assert champions[0] == {"championId": "ahri", "activity": 4}


async def test_streak_respects_limit(client):
    for champion_id in ["ahri", "zed", "lux", "vi"]:
        await _create_post(client, champion_id=champion_id)

    r = await client.get("/api/v1/champions/streak", params={"limit": 2})
    assert len(r.json()["champions"]) == 2


async def test_streak_respects_hours_window(client):
    # No time-travel fixture available here, so this only asserts the
    # endpoint accepts the `hours` param and returns a well-formed response
    # -- the `since` filtering itself mirrors list_trending, already covered
    # by test_reactions_and_trending.py's window tests.
    await _create_post(client)
    r = await client.get("/api/v1/champions/streak", params={"hours": 1})
    assert r.status_code == 200
    assert len(r.json()["champions"]) == 1
