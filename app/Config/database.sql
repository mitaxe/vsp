CREATE TABLE articles
(
    id INTEGER PRIMARY KEY NOT NULL,
    actual BOOLEAN,
    title TEXT,
    description TEXT,
    dt_created TIMESTAMP WITH TIME ZONE,
    dt_modified TIMESTAMP WITH TIME ZONE,
    thumb_default TEXT,
    thumb_high TEXT,
    thumb_medium TEXT,
    vsp_video_id TEXT
);
CREATE UNIQUE INDEX articles_id_uindex ON articles (id);

CREATE TABLE channel_tags
(
    channel_id INTEGER,
    tag_id INTEGER,
    CONSTRAINT channel_tags_channel_id_fkey2 FOREIGN KEY (channel_id) REFERENCES ,
    CONSTRAINT channel_tags_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES ,
    CONSTRAINT channel_tags_channel_id_fkey1 FOREIGN KEY (channel_id) REFERENCES ,
    CONSTRAINT channel_tags_tag_id_fkey2 FOREIGN KEY (tag_id) REFERENCES tags (id),
    CONSTRAINT channel_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags (id),
    CONSTRAINT channel_tags_tag_id_fkey1 FOREIGN KEY (tag_id) REFERENCES tags (id)
);
CREATE UNIQUE INDEX channel_tags_channel_id_tag_id_pk ON channel_tags (channel_id, tag_id);


CREATE TABLE channels
(
    id INTEGER PRIMARY KEY NOT NULL,
    vsp_channel_id VARCHAR(24),
    vsp_ref_id TEXT,
    vsp_ref_type VARCHAR(2),
    actual BOOLEAN,
    dt_created TIMESTAMP WITH TIME ZONE,
    dt_published TIMESTAMP WITH TIME ZONE,
    dt_updated TIMESTAMP WITH TIME ZONE,
    description TEXT,
    skin_base TEXT,
    skin_bg TEXT,
    skin_header TEXT,
    slug TEXT,
    src_id VARCHAR(24),
    src_type VARCHAR(2),
    stat_comments INTEGER,
    stat_dislikes INTEGER,
    stat_likes INTEGER,
    stat_playlists INTEGER,
    stat_subscribers INTEGER,
    stat_videos INTEGER,
    stat_views INTEGER,
    status TEXT,
    thumb_default TEXT,
    thumb_high TEXT,
    thumb_medium TEXT,
    title TEXT,
    tags JSONB,
    dt_sync TIMESTAMP WITH TIME ZONE,
    vsp_user_id TEXT
);
COMMENT ON COLUMN channels.slug IS 'internet name';
COMMENT ON COLUMN channels.stat_playlists IS 'calculated?';
COMMENT ON COLUMN channels.stat_subscribers IS 'calculated?';
COMMENT ON COLUMN channels.stat_videos IS 'calculated?';
CREATE INDEX channels__vsp_channel_id_index ON channels (vsp_channel_id);

CREATE TABLE goods
(
    id INTEGER PRIMARY KEY NOT NULL,
    vsp_goods_id VARCHAR(24),
    vsp_channel_id VARCHAR(24),
    category_id VARCHAR(24),
    actual BOOLEAN,
    dt_created TIMESTAMP WITH TIME ZONE,
    description TEXT,
    img_default VARCHAR(255),
    img_high VARCHAR(255),
    img_small VARCHAR(255),
    is_root BOOLEAN,
    price DOUBLE PRECISION,
    properties JSONB,
    slug VARCHAR(255),
    src_id VARCHAR(255),
    src_type VARCHAR(10),
    tags JSONB,
    thumbnails JSONB,
    title VARCHAR(255),
    dt_updated TIMESTAMP WITH TIME ZONE,
    dt_sync TIMESTAMP WITH TIME ZONE
);
CREATE UNIQUE INDEX goods_id_uindex ON goods (id);


CREATE TABLE playlist_videos_xref
(
    id INTEGER PRIMARY KEY NOT NULL,
    playlist_id INTEGER NOT NULL,
    video_id INTEGER NOT NULL,
    position INTEGER,
    status VARCHAR(10),
    title TEXT,
    CONSTRAINT playlist_videos_xref_playlist_id_fkey FOREIGN KEY (playlist_id) REFERENCES playlists (id),
    CONSTRAINT playlist_videos_xref_playlist_id_fkey1 FOREIGN KEY (playlist_id) REFERENCES playlists (id),
    CONSTRAINT playlist_videos_xref_video_id_fkey FOREIGN KEY (video_id) REFERENCES videos (id),
    CONSTRAINT playlist_videos_xref_video_id_fkey1 FOREIGN KEY (video_id) REFERENCES videos (id)
);

CREATE TABLE playlists
(
    id INTEGER PRIMARY KEY NOT NULL,
    vsp_playlist_id VARCHAR(24),
    vsp_channel_id VARCHAR(24),
    actual BOOLEAN,
    dt_created TIMESTAMP WITH TIME ZONE,
    dt_published TIMESTAMP WITH TIME ZONE,
    dt_updated TIMESTAMP WITH TIME ZONE,
    description TEXT,
    src_id VARCHAR,
    src_type VARCHAR(2),
    stat_public INTEGER,
    stat_unlisted INTEGER,
    status VARCHAR,
    thumbs_default TEXT,
    thumbs_high TEXT,
    thumbs_medium TEXT,
    title TEXT,
    channel_id INTEGER NOT NULL,
    src_channel_id VARCHAR(30),
    dt_sync TIMESTAMP WITH TIME ZONE,
    CONSTRAINT playlists_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES
);

CREATE TABLE tags
(
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT
);

CREATE TABLE user_channels_xref
(
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    channel_id INTEGER NOT NULL,
    subscribed BOOLEAN,
    CONSTRAINT user_channels_xref_user_id_fkey FOREIGN KEY (user_id) REFERENCES ,
    CONSTRAINT user_channels_xref_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES
);

CREATE TABLE user_video_xref
(
    id INTEGER PRIMARY KEY NOT NULL,
    video_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    liked BOOLEAN,
    viewed BOOLEAN,
    CONSTRAINT user_video_xref_video_id_fkey FOREIGN KEY (video_id) REFERENCES videos (id),
    CONSTRAINT user_video_xref_user_id_fkey FOREIGN KEY (user_id) REFERENCES
);

CREATE TABLE users
(
    id INTEGER PRIMARY KEY NOT NULL,
    login TEXT,
    password TEXT,
    email TEXT,
    is_partner BOOLEAN,
    dt_modified TIMESTAMP WITH TIME ZONE,
    dt_created TIMESTAMP WITH TIME ZONE,
    dt_last_login TIMESTAMP WITH TIME ZONE,
    is_admin BOOLEAN,
    actual BOOLEAN,
    vsp_user_id TEXT
);

CREATE TABLE users_details
(
    id INTEGER DEFAULT nextval('users_details_id_seq'::regclass),
    user_id INTEGER,
    first_name TEXT,
    last_name TEXT,
    middle_name TEXT,
    picture TEXT,
    description TEXT,
    city TEXT,
    dt_birthday DATE
);
CREATE UNIQUE INDEX users_details_id_pk ON users_details (id);

CREATE TABLE video_tags
(
    video_id INTEGER,
    tag_id INTEGER,
    CONSTRAINT video_tags_video_id_fkey FOREIGN KEY (video_id) REFERENCES videos (id),
    CONSTRAINT video_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags (id)
);
CREATE UNIQUE INDEX video_tags_video_id_tag_id_pk ON video_tags (video_id, tag_id);


CREATE TABLE videos
(
    id INTEGER PRIMARY KEY NOT NULL,
    vsp_video_id VARCHAR(24),
    vsp_channel_id VARCHAR(24),
    actual BOOLEAN,
    dt_created TIMESTAMP WITH TIME ZONE,
    dt_published TIMESTAMP WITH TIME ZONE,
    dt_updated TIMESTAMP WITH TIME ZONE,
    description TEXT,
    duration_iso0860 VARCHAR,
    duration_seconds INTEGER,
    is_embeddable BOOLEAN,
    is_root BOOLEAN,
    src_id VARCHAR,
    src_type VARCHAR(2),
    src_channel_id VARCHAR,
    stat_comments INTEGER,
    stat_dislikes INTEGER,
    stat_likes INTEGER,
    stat_views INTEGER,
    status VARCHAR,
    thumbs_default TEXT,
    thumbs_high TEXT,
    thumbs_medium TEXT,
    title TEXT,
    channel_id INTEGER NOT NULL,
    tags JSONB,
    exclusive BOOLEAN DEFAULT false,
    dt_sync TIMESTAMP WITH TIME ZONE,
    CONSTRAINT videos_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES
);
CREATE INDEX videos__vsp_video_id_index ON videos (vsp_video_id);