import pytest


async def _create_post(client, champion_id="ahri", content="hola mundo"):
    r = await client.post(
        "/api/v1/posts", json={"championId": champion_id, "content": content}
    )
    assert r.status_code == 201
    return r.json()


async def test_create_post_returns_post_with_zero_counts(client):
    post = await _create_post(client)
    assert post["championId"] == "ahri"
    assert post["content"] == "hola mundo"
    assert post["responseOf"] is None
    assert post["quoteOf"] is None
    assert post["responsesCount"] == 0
    assert post["quotesCount"] == 0
    assert post["createdAt"] is not None


async def test_create_post_rejects_empty_content(client):
    r = await client.post("/api/v1/posts", json={"championId": "ahri", "content": ""})
    assert r.status_code == 422


async def test_create_post_rejects_content_over_max_length(client):
    r = await client.post(
        "/api/v1/posts", json={"championId": "ahri", "content": "a" * 281}
    )
    assert r.status_code == 422


async def test_create_post_rejects_missing_champion_id(client):
    r = await client.post("/api/v1/posts", json={"content": "hola"})
    assert r.status_code == 422


async def test_get_post_by_id(client):
    post = await _create_post(client)
    r = await client.get(f"/api/v1/posts/{post['id']}")
    assert r.status_code == 200
    assert r.json()["id"] == post["id"]


async def test_get_nonexistent_post_returns_404(client):
    r = await client.get("/api/v1/posts/00000000-0000-0000-0000-000000000000")
    assert r.status_code == 404


async def test_get_post_with_malformed_id_returns_422(client):
    r = await client.get("/api/v1/posts/not-a-uuid")
    assert r.status_code == 422


async def test_list_posts_only_returns_root_posts(client):
    root = await _create_post(client, content="root post")
    await client.post(
        f"/api/v1/posts/{root['id']}/responses",
        json={"championId": "yasuo", "content": "a reply"},
    )

    r = await client.get("/api/v1/posts")
    assert r.status_code == 200
    body = r.json()
    assert body["count"] == 1
    assert [p["id"] for p in body["posts"]] == [root["id"]]


async def test_list_posts_includes_standalone_quotes_as_root(client):
    root = await _create_post(client, content="root post")
    quote = await client.post(
        f"/api/v1/posts/{root['id']}/quotes",
        json={"championId": "zed", "content": "quoting this"},
    )
    assert quote.status_code == 201

    r = await client.get("/api/v1/posts")
    body = r.json()
    ids = {p["id"] for p in body["posts"]}
    assert body["count"] == 2
    assert ids == {root["id"], quote.json()["id"]}


async def test_list_posts_filters_by_champion(client):
    await _create_post(client, champion_id="ahri", content="ahri post")
    await _create_post(client, champion_id="zed", content="zed post")

    r = await client.get("/api/v1/posts", params={"championId": "ahri"})
    body = r.json()
    assert body["count"] == 1
    assert body["posts"][0]["championId"] == "ahri"


async def test_list_posts_orders_by_created_at_ascending(client):
    first = await _create_post(client, content="first")
    second = await _create_post(client, content="second")

    r = await client.get("/api/v1/posts")
    ids = [p["id"] for p in r.json()["posts"]]
    assert ids == [first["id"], second["id"]]


async def test_list_posts_pagination(client):
    for i in range(3):
        await _create_post(client, content=f"post {i}")

    r = await client.get("/api/v1/posts", params={"limit": 1, "offset": 1})
    body = r.json()
    assert body["count"] == 3
    assert len(body["posts"]) == 1


async def test_create_response_increments_parent_responses_count(client):
    root = await _create_post(client)
    r = await client.post(
        f"/api/v1/posts/{root['id']}/responses",
        json={"championId": "yasuo", "content": "responding"},
    )
    assert r.status_code == 201
    response = r.json()
    assert response["responseOf"] == root["id"]

    parent = (await client.get(f"/api/v1/posts/{root['id']}")).json()
    assert parent["responsesCount"] == 1
    assert parent["quotesCount"] == 0


async def test_create_response_on_nonexistent_post_returns_404(client):
    r = await client.post(
        "/api/v1/posts/00000000-0000-0000-0000-000000000000/responses",
        json={"championId": "yasuo", "content": "responding"},
    )
    assert r.status_code == 404


async def test_list_responses_for_a_post(client):
    root = await _create_post(client)
    other_root = await _create_post(client, content="unrelated")
    reply = await client.post(
        f"/api/v1/posts/{root['id']}/responses",
        json={"championId": "yasuo", "content": "reply 1"},
    )
    await client.post(
        f"/api/v1/posts/{other_root['id']}/responses",
        json={"championId": "zed", "content": "unrelated reply"},
    )

    r = await client.get(f"/api/v1/posts/{root['id']}/responses")
    body = r.json()
    assert body["count"] == 1
    assert body["posts"][0]["id"] == reply.json()["id"]


async def test_create_quote_increments_parent_quotes_count(client):
    root = await _create_post(client)
    r = await client.post(
        f"/api/v1/posts/{root['id']}/quotes",
        json={"championId": "zed", "content": "quoting"},
    )
    assert r.status_code == 201
    quote = r.json()
    assert quote["quoteOf"] == root["id"]

    parent = (await client.get(f"/api/v1/posts/{root['id']}")).json()
    assert parent["quotesCount"] == 1
    assert parent["responsesCount"] == 0


async def test_list_quotes_for_a_post(client):
    root = await _create_post(client)
    quote = await client.post(
        f"/api/v1/posts/{root['id']}/quotes",
        json={"championId": "zed", "content": "quoting"},
    )

    r = await client.get(f"/api/v1/posts/{root['id']}/quotes")
    body = r.json()
    assert body["count"] == 1
    assert body["posts"][0]["id"] == quote.json()["id"]


async def test_list_champion_posts(client):
    await _create_post(client, champion_id="ahri", content="ahri root")
    ahri_post = await _create_post(client, champion_id="ahri", content="ahri root 2")
    await client.post(
        f"/api/v1/posts/{ahri_post['id']}/responses",
        json={"championId": "ahri", "content": "ahri reply"},
    )

    r = await client.get("/api/v1/champions/ahri/posts")
    body = r.json()
    assert body["count"] == 2


async def test_list_champion_responses(client):
    root = await _create_post(client, champion_id="zed")
    await client.post(
        f"/api/v1/posts/{root['id']}/responses",
        json={"championId": "ahri", "content": "ahri responding as ahri"},
    )

    r = await client.get("/api/v1/champions/ahri/responses")
    body = r.json()
    assert body["count"] == 1


async def test_health_endpoint(client):
    r = await client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}
