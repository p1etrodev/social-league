from app import crud


async def test_get_post_counts_only_direct_children(db_session):
    root = await crud.create_post(db_session, champion_id="ahri", content="root")
    await crud.create_post(
        db_session, champion_id="yasuo", content="r1", response_of=root["id"]
    )
    await crud.create_post(
        db_session, champion_id="zed", content="r2", response_of=root["id"]
    )
    await crud.create_post(
        db_session, champion_id="lux", content="q1", quote_of=root["id"]
    )

    fetched = await crud.get_post(db_session, root["id"])
    assert fetched["responses_count"] == 2
    assert fetched["quotes_count"] == 1


async def test_counts_do_not_leak_across_unrelated_posts(db_session):
    # Regression test for a real bug found via manual smoke testing: an
    # uncorrelated subquery counted rows where response_of == that row's own
    # id (always ~0) instead of children of each post -- and without a
    # second unrelated post in the table, an off-by-self-reference bug can
    # accidentally look correct.
    post_a = await crud.create_post(db_session, champion_id="ahri", content="a")
    post_b = await crud.create_post(db_session, champion_id="zed", content="b")
    await crud.create_post(
        db_session, champion_id="yasuo", content="reply to a", response_of=post_a["id"]
    )

    fetched_a = await crud.get_post(db_session, post_a["id"])
    fetched_b = await crud.get_post(db_session, post_b["id"])
    assert fetched_a["responses_count"] == 1
    assert fetched_b["responses_count"] == 0


async def test_list_root_posts_excludes_responses_but_includes_quotes(db_session):
    root = await crud.create_post(db_session, champion_id="ahri", content="root")
    await crud.create_post(
        db_session, champion_id="yasuo", content="reply", response_of=root["id"]
    )
    quote = await crud.create_post(
        db_session, champion_id="zed", content="quote", quote_of=root["id"]
    )

    posts, count = await crud.list_root_posts(db_session, None, 50, 0)
    ids = {p["id"] for p in posts}
    assert count == 2
    assert ids == {root["id"], quote["id"]}


async def test_get_post_returns_none_for_missing_id(db_session):
    import uuid

    result = await crud.get_post(db_session, uuid.uuid4())
    assert result is None
