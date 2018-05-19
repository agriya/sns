--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.10
-- Dumped by pg_dump version 9.5.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE activities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE activities (
    id bigint DEFAULT nextval('activities_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    owner_user_id bigint NOT NULL,
    user_id bigint NOT NULL,
    foreign_id bigint NOT NULL,
    class character varying(100),
    type character varying(100),
    is_read boolean DEFAULT false NOT NULL
);


--
-- Name: attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: attachments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE attachments (
    id bigint DEFAULT nextval('attachments_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone DEFAULT '1970-01-01 00:00:00'::timestamp without time zone NOT NULL,
    updated_at timestamp without time zone DEFAULT '1970-01-01 00:00:00'::timestamp without time zone NOT NULL,
    class character varying(100) DEFAULT ''::character varying NOT NULL,
    foreign_id bigint DEFAULT (0)::bigint NOT NULL,
    filename character varying(255) DEFAULT ''::character varying NOT NULL,
    dir character varying(100) DEFAULT ''::character varying NOT NULL,
    mimetype character varying(100) DEFAULT ''::character varying NOT NULL,
    filesize bigint DEFAULT (0)::bigint NOT NULL,
    height bigint DEFAULT (0)::bigint NOT NULL,
    width bigint DEFAULT (0)::bigint NOT NULL,
    thumb smallint DEFAULT (0)::smallint NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    amazon_s3_thumb_url text DEFAULT ''::text NOT NULL,
    amazon_s3_original_url text DEFAULT ''::text NOT NULL,
    CONSTRAINT attachments_foreign_id_check CHECK ((foreign_id >= 0))
);


--
-- Name: banned_ips_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE banned_ips_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: banned_ips; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE banned_ips (
    id bigint DEFAULT nextval('banned_ips_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    address character varying(255) DEFAULT NULL::character varying,
    range text,
    reason character varying(255) DEFAULT NULL::character varying,
    redirect character varying(255) DEFAULT NULL::character varying,
    thetime integer NOT NULL,
    timespan integer NOT NULL
);


--
-- Name: cities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE cities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE cities (
    id bigint DEFAULT nextval('cities_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    country_id bigint NOT NULL,
    state_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    city_code character varying(5),
    slug character varying(265) NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE contacts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE contacts (
    id bigint DEFAULT nextval('contacts_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    ip_id character varying(50) NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    phone character varying(20) NOT NULL,
    subject text NOT NULL,
    message text NOT NULL
);


--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE countries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE countries (
    id integer DEFAULT nextval('countries_id_seq'::regclass) NOT NULL,
    iso_alpha2 character(2) DEFAULT NULL::bpchar,
    iso_alpha3 character(3) DEFAULT NULL::bpchar,
    iso_numeric integer,
    fips_code character varying(3) DEFAULT NULL::character varying,
    name character varying(200) DEFAULT NULL::character varying,
    capital character varying(200) DEFAULT NULL::character varying,
    areainsqkm double precision,
    population integer,
    continent character(2) DEFAULT NULL::bpchar,
    tld character(3) DEFAULT NULL::bpchar,
    currency character(3) DEFAULT NULL::bpchar,
    currencyname character(20) DEFAULT NULL::bpchar,
    phone character(10) DEFAULT NULL::bpchar,
    postalcodeformat character(20) DEFAULT NULL::bpchar,
    postalcoderegex character(20) DEFAULT NULL::bpchar,
    languages character varying(200) DEFAULT NULL::character varying,
    geonameid integer,
    neighbours character(20) DEFAULT NULL::bpchar,
    equivalentfipscode character(10) DEFAULT NULL::bpchar,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: email_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE email_templates_id_seq
    START WITH 3
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: email_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE email_templates (
    id bigint DEFAULT nextval('email_templates_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    "from" character varying(100) NOT NULL,
    reply_to character varying(100) NOT NULL,
    subject character varying(300) NOT NULL,
    email_variables character varying(500) NOT NULL,
    email_content text,
    text_content text,
    is_html smallint DEFAULT (1)::smallint NOT NULL,
    is_text smallint DEFAULT (0)::smallint NOT NULL,
    display_label character varying(265)
);


--
-- Name: flags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE flags (
    id bigint NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    flagged_user_id bigint,
    user_id bigint NOT NULL,
    photo_id bigint,
    ip_id bigint,
    flag_category_id bigint NOT NULL,
    type character varying(100) DEFAULT 'photo / user'::character varying NOT NULL
);


--
-- Name: flags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE flags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE flags_id_seq OWNED BY flags.id;


--
-- Name: ips_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE ips_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ips; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE ips (
    id bigint DEFAULT nextval('ips_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    ip character varying(255) NOT NULL,
    host character varying(255) NOT NULL,
    city_id bigint,
    state_id bigint,
    country_id bigint,
    timezone_id bigint,
    latitude double precision,
    longitude double precision
);


--
-- Name: languages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE languages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: languages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE languages (
    id bigint DEFAULT nextval('languages_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name character varying(255) NOT NULL,
    iso2 character(2) NOT NULL,
    iso3 character(3) NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: message_contents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE message_contents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: message_contents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE message_contents (
    id bigint DEFAULT nextval('message_contents_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    message text
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE messages (
    id bigint DEFAULT nextval('messages_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    user_id bigint DEFAULT (0)::bigint,
    other_user_id bigint DEFAULT (0)::bigint,
    is_sender smallint DEFAULT (0)::smallint NOT NULL,
    is_read smallint DEFAULT (0)::smallint,
    parent_message_id bigint,
    message text,
    message_content_id bigint NOT NULL
);


--
-- Name: money_transfer_account_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE money_transfer_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oauth_access_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE oauth_access_tokens (
    access_token character varying(40) NOT NULL,
    client_id character varying(80),
    user_id character varying(255),
    expires timestamp without time zone,
    scope text
);


--
-- Name: oauth_authorization_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE oauth_authorization_codes (
    authorization_code character varying(40) NOT NULL,
    client_id character varying(80),
    user_id character varying(255),
    redirect_uri character varying(2000),
    expires timestamp without time zone,
    scope character varying(2000)
);


--
-- Name: oauth_clients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE oauth_clients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: oauth_clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE oauth_clients (
    id integer DEFAULT nextval('oauth_clients_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    client_id character varying(80) NOT NULL,
    client_secret character varying(80),
    redirect_uri character varying(2000),
    grant_types character varying(80),
    scope character varying(100),
    user_id character varying(80),
    client_name character varying(255),
    client_url character varying(255),
    logo_url character varying(255),
    tos_url character varying(255),
    policy_url character varying(2000)
);


--
-- Name: oauth_jwt; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE oauth_jwt (
    client_id character varying(80) NOT NULL,
    subject character varying(80),
    public_key character varying(2000)
);


--
-- Name: oauth_refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE oauth_refresh_tokens (
    refresh_token character varying(40) NOT NULL,
    client_id character varying(80),
    user_id character varying(255),
    expires timestamp without time zone,
    scope text
);


--
-- Name: oauth_scopes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE oauth_scopes (
    scope text NOT NULL,
    is_default boolean
);


--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE pages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE pages (
    id bigint DEFAULT nextval('pages_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(265) NOT NULL,
    content text NOT NULL,
    meta_keywords character varying(255) DEFAULT NULL::character varying,
    meta_description text,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: photo_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE photo_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photo_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE photo_comments (
    id integer DEFAULT nextval('photo_comments_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    photo_id bigint NOT NULL,
    user_id bigint NOT NULL,
    ip_id bigint,
    comment text NOT NULL
);


--
-- Name: photo_comments_id_seq1; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE photo_comments_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photo_comments_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE photo_comments_id_seq1 OWNED BY photo_comments.id;


--
-- Name: photo_flag_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE photo_flag_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photo_flags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE photo_flags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photo_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE photo_likes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photo_likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE photo_likes (
    id integer DEFAULT nextval('photo_likes_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    photo_id bigint NOT NULL,
    user_id bigint NOT NULL,
    ip_id bigint
);


--
-- Name: photo_likes_id_seq1; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE photo_likes_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photo_likes_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE photo_likes_id_seq1 OWNED BY photo_likes.id;


--
-- Name: photo_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE photo_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photo_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE photo_tags (
    id bigint DEFAULT nextval('photo_tags_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    photo_count bigint DEFAULT (0)::bigint
);


--
-- Name: photo_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE photo_views (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    photo_id bigint NOT NULL,
    user_id bigint,
    ip_id bigint
);


--
-- Name: photo_views_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE photo_views_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photo_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE photo_views_id_seq OWNED BY photo_views.id;


--
-- Name: photos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE photos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE photos (
    id bigint DEFAULT nextval('photos_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    user_id bigint NOT NULL,
    description text NOT NULL,
    photo_comment_count smallint DEFAULT (0)::smallint,
    photo_like_count smallint DEFAULT (0)::smallint,
    photo_flag_count smallint DEFAULT (0)::smallint,
    photo_view_count smallint DEFAULT '0'::smallint,
    is_video boolean DEFAULT false NOT NULL,
    is_attachment_to_view boolean DEFAULT true NOT NULL,
    is_video_converting_is_processing boolean DEFAULT false NOT NULL
);


--
-- Name: photos_id_seq1; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE photos_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photos_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE photos_id_seq1 OWNED BY photos.id;


--
-- Name: photos_photo_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE photos_photo_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photos_photo_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE photos_photo_tags (
    id integer DEFAULT nextval('photos_photo_tags_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    photo_id bigint NOT NULL,
    photo_tag_id bigint NOT NULL,
    is_indirect_tag boolean DEFAULT false NOT NULL
);


--
-- Name: photos_photo_tags_id_seq1; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE photos_photo_tags_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photos_photo_tags_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE photos_photo_tags_id_seq1 OWNED BY photos_photo_tags.id;


--
-- Name: provider_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE provider_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: provider_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE provider_users (
    id bigint DEFAULT nextval('provider_users_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    user_id bigint DEFAULT 0 NOT NULL,
    provider_id bigint DEFAULT 0 NOT NULL,
    access_token character varying(255),
    access_token_secret character varying(255),
    is_connected boolean DEFAULT true NOT NULL,
    profile_picture_url character varying(255),
    foreign_id character varying(255)
);


--
-- Name: providers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE providers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: providers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE providers (
    id bigint DEFAULT nextval('providers_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name character varying(255),
    secret_key character varying(255),
    api_key character varying(255),
    icon_class character varying(255),
    button_class character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    display_order bigint,
    slug character varying(265) NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE roles (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name character varying(50) NOT NULL,
    is_active boolean NOT NULL
);


--
-- Name: setting_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE setting_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: setting_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE setting_categories (
    id bigint DEFAULT nextval('setting_categories_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name character varying(200) NOT NULL,
    description text NOT NULL
);


--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE settings (
    id bigint DEFAULT nextval('settings_id_seq'::regclass) NOT NULL,
    setting_category_id bigint NOT NULL,
    name character varying(255) DEFAULT NULL::character varying,
    value text,
    description text,
    type character varying(8) DEFAULT NULL::character varying,
    label character varying(255) DEFAULT NULL::character varying,
    "order" integer NOT NULL,
    options text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: states_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE states_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: states; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE states (
    id bigint DEFAULT nextval('states_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    country_id bigint NOT NULL,
    name character varying(80) DEFAULT NULL::character varying,
    state_code character varying(5) DEFAULT NULL::character varying,
    slug character varying(100) DEFAULT NULL::character varying,
    is_active boolean DEFAULT true NOT NULL,
    CONSTRAINT states_country_id_check CHECK ((country_id >= 0))
);


--
-- Name: user_follows_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE user_follows_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_follows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE user_follows (
    id integer DEFAULT nextval('user_follows_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    user_id bigint NOT NULL,
    other_user_id bigint NOT NULL
);


--
-- Name: user_follows_id_seq1; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE user_follows_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_follows_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE user_follows_id_seq1 OWNED BY user_follows.id;


--
-- Name: user_logins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE user_logins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_logins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE user_logins (
    id bigint DEFAULT nextval('user_logins_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    user_id bigint NOT NULL,
    ip_id bigint,
    user_agent text
);


--
-- Name: user_notification_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE user_notification_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_notification_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE user_notification_settings (
    id integer DEFAULT nextval('user_notification_settings_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    user_id bigint NOT NULL,
    is_enable_email_when_someone_follow_me boolean DEFAULT true NOT NULL,
    is_enable_email_when_someone_mentioned_me boolean DEFAULT true NOT NULL,
    is_enable_email_when_someone_message_me boolean DEFAULT true NOT NULL,
    is_enable_subscribe_me_for_newsletter boolean DEFAULT true NOT NULL,
    is_enable_subscribe_me_for_weeky_replay boolean DEFAULT true NOT NULL,
    is_enable_email_when_follow_post boolean DEFAULT true NOT NULL
);


--
-- Name: user_notification_settings_id_seq1; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE user_notification_settings_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_notification_settings_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE user_notification_settings_id_seq1 OWNED BY user_notification_settings.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE users (
    id bigint DEFAULT nextval('users_id_seq'::regclass) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    role_id integer DEFAULT 2 NOT NULL,
    last_login_ip_id character varying(30),
    email character varying(256) NOT NULL,
    password character varying(256) NOT NULL,
    is_email_confirmed boolean DEFAULT false NOT NULL,
    is_agree_terms_conditions boolean DEFAULT false NOT NULL,
    username character varying(255) NOT NULL,
    last_logged_in_time timestamp without time zone,
    provider_id bigint,
    first_name character varying(150),
    last_name character varying(150),
    gender_id smallint,
    dob date,
    about_me text,
    address character varying(255),
    address1 character varying(255),
    city_id bigint,
    state_id bigint,
    country_id bigint,
    zip_code character varying(50),
    latitude numeric(10,6),
    longitude numeric(10,6),
    is_active boolean DEFAULT false NOT NULL,
    twitter_username character varying(255),
    facebook_username character varying(255),
    instagram_username character varying(255),
    linkedin_username character varying(255),
    medium_username character varying(255),
    youtube_username character varying(255),
    etsy_username character varying(255),
    educations text,
    brands text,
    recognitions text,
    website character varying(255),
    middle_name character varying(255),
    unread_activities_count bigint DEFAULT (0)::bigint NOT NULL,
    unread_messages_count bigint DEFAULT (0)::bigint NOT NULL,
    user_following_count bigint DEFAULT (0)::bigint NOT NULL,
    user_follower_count bigint DEFAULT (0)::bigint NOT NULL,
    is_show_profile_picture_in_search_engine boolean DEFAULT true NOT NULL,
    is_show_pictures_in_search_engine boolean DEFAULT true NOT NULL,
    user_login_count bigint DEFAULT (0)::bigint NOT NULL,
    photo_count bigint DEFAULT (0)::bigint NOT NULL,
    mobile character varying(255),
    user_notification_setting_id bigint DEFAULT (0)::bigint NOT NULL,
    full_address character varying(510),
    flag_count bigint DEFAULT '0'::bigint
);


--
-- Name: COLUMN users.role_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN users.role_id IS '1-admin,2-user';


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY flags ALTER COLUMN id SET DEFAULT nextval('flags_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY photo_views ALTER COLUMN id SET DEFAULT nextval('photo_views_id_seq'::regclass);


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY activities (id, created_at, updated_at, owner_user_id, user_id, foreign_id, class, type, is_read) FROM stdin;
\.


--
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('activities_id_seq', 1, false);


--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY attachments (id, created_at, updated_at, class, foreign_id, filename, dir, mimetype, filesize, height, width, thumb, description, amazon_s3_thumb_url, amazon_s3_original_url) FROM stdin;
\.


--
-- Name: attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('attachments_id_seq', 1, true);


--
-- Data for Name: banned_ips; Type: TABLE DATA; Schema: public; Owner: -
--

COPY banned_ips (id, created_at, updated_at, address, range, reason, redirect, thetime, timespan) FROM stdin;
\.


--
-- Name: banned_ips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('banned_ips_id_seq', 1, false);


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY cities (id, created_at, updated_at, country_id, state_id, name, city_code, slug, is_active) FROM stdin;
\.


--
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('cities_id_seq', 1, true);


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY contacts (id, created_at, updated_at, ip_id, first_name, last_name, email, phone, subject, message) FROM stdin;
\.


--
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('contacts_id_seq', 1, true);


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY countries (id, iso_alpha2, iso_alpha3, iso_numeric, fips_code, name, capital, areainsqkm, population, continent, tld, currency, currencyname, phone, postalcodeformat, postalcoderegex, languages, geonameid, neighbours, equivalentfipscode, created_at, updated_at) FROM stdin;
1	AF	AFG	4	AF	Afghanistan	Kabul	647500	29121286	AS	.af	AFN	Afghani             	93        	                    	                    	fa-AF,ps,uz-AF,tk	1149361	TM,CN,IR,TJ,PK,UZ   	\\r        	\N	\N
2	AX	ALA	248		Aland Islands	Mariehamn	0	26711	EU	.ax	EUR	Euro                	+358-18   	                    	                    	sv-AX	661882	                    	FI\\r      	\N	\N
3	AL	ALB	8	AL	Albania	Tirana	28748	2986952	EU	.al	ALL	Lek                 	355       	                    	                    	sq,el	783754	MK,GR,CS,ME,RS,XK   	\\r        	\N	\N
4	DZ	DZA	12	AG	Algeria	Algiers	2381740	34586184	AF	.dz	DZD	Dinar               	213       	#####               	^(d{5})$            	ar-DZ	2589581	NE,EH,LY,MR,TN,MA,ML	\\r        	\N	\N
5	AS	ASM	16	AQ	American Samoa	Pago Pago	199	57881	OC	.as	USD	Dollar              	+1-684    	                    	                    	en-AS,sm,to	5880801	                    	\\r        	\N	\N
6	AD	AND	20	AN	Andorra	Andorra la Vella	468	84000	EU	.ad	EUR	Euro                	376       	AD###               	^(?:AD)*(d{3})$     	ca	3041565	ES,FR               	\\r        	\N	\N
7	AO	AGO	24	AO	Angola	Luanda	1246700	13068161	AF	.ao	AOA	Kwanza              	244       	                    	                    	pt-AO	3351879	CD,NA,ZM,CG         	\\r        	\N	\N
8	AI	AIA	660	AV	Anguilla	The Valley	102	13254	NA	.ai	XCD	Dollar              	+1-264    	                    	                    	en-AI	3573511	                    	\\r        	\N	\N
9	AQ	ATA	10	AY	Antarctica		14000000	0	AN	.aq	   	                    	          	                    	                    		6697173	                    	\\r        	\N	\N
10	AG	ATG	28	AC	Antigua and Barbuda	St. Johns	443	86754	NA	.ag	XCD	Dollar              	+1-268    	                    	                    	en-AG	3576396	                    	\\r        	\N	\N
11	AR	ARG	32	AR	Argentina	Buenos Aires	2766890	41343201	SA	.ar	ARS	Peso                	54        	@####@@@            	^([A-Z]d{4}[A-Z]{3})	es-AR,en,it,de,fr,gn	3865483	CL,BO,UY,PY,BR      	\\r        	\N	\N
12	AM	ARM	51	AM	Armenia	Yerevan	29800	2968000	AS	.am	AMD	Dram                	374       	######              	^(d{6})$            	hy	174982	GE,IR,AZ,TR         	\\r        	\N	\N
13	AW	ABW	533	AA	Aruba	Oranjestad	193	71566	NA	.aw	AWG	Guilder             	297       	                    	                    	nl-AW,es,en	3577279	                    	\\r        	\N	\N
14	AU	AUS	36	AS	Australia	Canberra	7686850	21515754	OC	.au	AUD	Dollar              	61        	####                	^(d{4})$            	en-AU	2077456	                    	\\r        	\N	\N
15	AT	AUT	40	AU	Austria	Vienna	83858	8205000	EU	.at	EUR	Euro                	43        	####                	^(d{4})$            	de-AT,hr,hu,sl	2782113	CH,DE,HU,SK,CZ,IT,SI	\\r        	\N	\N
16	AZ	AZE	31	AJ	Azerbaijan	Baku	86600	8303512	AS	.az	AZN	Manat               	994       	AZ ####             	^(?:AZ)*(d{4})$     	az,ru,hy	587116	GE,IR,AM,TR,RU      	\\r        	\N	\N
17	BS	BHS	44	BF	Bahamas	Nassau	13940	301790	NA	.bs	BSD	Dollar              	+1-242    	                    	                    	en-BS	3572887	                    	\\r        	\N	\N
18	BH	BHR	48	BA	Bahrain	Manama	665	738004	AS	.bh	BHD	Dinar               	973       	####|###            	^(d{3}d?)$          	ar-BH,en,fa,ur	290291	                    	\\r        	\N	\N
19	BD	BGD	50	BG	Bangladesh	Dhaka	144000	156118464	AS	.bd	BDT	Taka                	880       	####                	^(d{4})$            	bn-BD,en	1210997	MM,IN               	\\r        	\N	\N
20	BB	BRB	52	BB	Barbados	Bridgetown	431	285653	NA	.bb	BBD	Dollar              	+1-246    	BB#####             	^(?:BB)*(d{5})$     	en-BB	3374084	                    	\\r        	\N	\N
21	BY	BLR	112	BO	Belarus	Minsk	207600	9685000	EU	.by	BYR	Ruble               	375       	######              	^(d{6})$            	be,ru	630336	PL,LT,UA,RU,LV      	\\r        	\N	\N
22	BE	BEL	56	BE	Belgium	Brussels	30510	10403000	EU	.be	EUR	Euro                	32        	####                	^(d{4})$            	nl-BE,fr-BE,de-BE	2802361	DE,NL,LU,FR         	          	\N	\N
23	BZ	BLZ	84	BH	Belize	Belmopan	22966	314522	NA	.bz	BZD	Dollar              	501       	                    	                    	en-BZ,es	3582678	GT,MX               	\\r        	\N	\N
24	BJ	BEN	204	BN	Benin	Porto-Novo	112620	9056010	AF	.bj	XOF	Franc               	229       	                    	                    	fr-BJ	2395170	NE,TG,BF,NG         	\\r        	\N	\N
25	BM	BMU	60	BD	Bermuda	Hamilton	53	65365	NA	.bm	BMD	Dollar              	+1-441    	@@ ##               	^([A-Z]{2}d{2})$    	en-BM,pt	3573345	                    	\\r        	\N	\N
26	BT	BTN	64	BT	Bhutan	Thimphu	47000	699847	AS	.bt	BTN	Ngultrum            	975       	                    	                    	dz	1252634	CN,IN               	\\r        	\N	\N
27	BO	BOL	68	BL	Bolivia	Sucre	1098580	9947418	SA	.bo	BOB	Boliviano           	591       	                    	                    	es-BO,qu,ay	3923057	PE,CL,PY,BR,AR      	\\r        	\N	\N
28	BQ	BES	535		Bonaire, Saint Eustatius and Saba 		0	18012	NA	.bq	USD	Dollar              	599       	                    	                    	nl,pap,en	7626844	                    	\\r        	\N	\N
29	BA	BIH	70	BK	Bosnia and Herzegovina	Sarajevo	51129	4590000	EU	.ba	BAM	Marka               	387       	#####               	^(d{5})$            	bs,hr-BA,sr-BA	3277605	CS,HR,ME,RS         	\\r        	\N	\N
30	BW	BWA	72	BC	Botswana	Gaborone	600370	2029307	AF	.bw	BWP	Pula                	267       	                    	                    	en-BW,tn-BW	933860	ZW,ZA,NA            	\\r        	\N	\N
31	BV	BVT	74	BV	Bouvet Island		0	0	AN	.bv	NOK	Krone               	          	                    	                    		3371123	                    	\\r        	\N	\N
32	BR	BRA	76	BR	Brazil	Brasilia	8511965	201103330	SA	.br	BRL	Real                	55        	#####-###           	^(d{8})$            	pt-BR,es,en,fr	3469034	SR,PE,BO,UY,GY,PY,GF	\\r        	\N	\N
33	IO	IOT	86	IO	British Indian Ocean Territory	Diego Garcia	60	4000	AS	.io	USD	Dollar              	246       	                    	                    	en-IO	1282588	                    	\\r        	\N	\N
34	VG	VGB	92	VI	British Virgin Islands	Road Town	153	21730	NA	.vg	USD	Dollar              	+1-284    	                    	                    	en-VG	3577718	                    	\\r        	\N	\N
35	BN	BRN	96	BX	Brunei	Bandar Seri Begawan	5770	395027	AS	.bn	BND	Dollar              	673       	@@####              	^([A-Z]{2}d{4})$    	ms-BN,en-BN	1820814	MY                  	\\r        	\N	\N
36	BG	BGR	100	BU	Bulgaria	Sofia	110910	7148785	EU	.bg	BGN	Lev                 	359       	####                	^(d{4})$            	bg,tr-BG	732800	MK,GR,RO,CS,TR,RS   	\\r        	\N	\N
37	BF	BFA	854	UV	Burkina Faso	Ouagadougou	274200	16241811	AF	.bf	XOF	Franc               	226       	                    	                    	fr-BF	2361809	NE,BJ,GH,CI,TG,ML   	\\r        	\N	\N
38	BI	BDI	108	BY	Burundi	Bujumbura	27830	9863117	AF	.bi	BIF	Franc               	257       	                    	                    	fr-BI,rn	433561	TZ,CD,RW            	\\r        	\N	\N
39	KH	KHM	116	CB	Cambodia	Phnom Penh	181040	14453680	AS	.kh	KHR	Riels               	855       	#####               	^(d{5})$            	km,fr,en	1831722	LA,TH,VN            	\\r        	\N	\N
40	CM	CMR	120	CM	Cameroon	Yaounde	475440	19294149	AF	.cm	XAF	Franc               	237       	                    	                    	en-CM,fr-CM	2233387	TD,CF,GA,GQ,CG,NG   	\\r        	\N	\N
41	CA	CAN	124	CA	Canada	Ottawa	9984670	33679000	NA	.ca	CAD	Dollar              	1         	@#@ #@#             	^([a-zA-Z]d[a-zA-Z]d	en-CA,fr-CA,iu	6251999	US                  	\\r        	\N	\N
42	CV	CPV	132	CV	Cape Verde	Praia	4033	508659	AF	.cv	CVE	Escudo              	238       	####                	^(d{4})$            	pt-CV	3374766	                    	\\r        	\N	\N
43	KY	CYM	136	CJ	Cayman Islands	George Town	262	44270	NA	.ky	KYD	Dollar              	+1-345    	                    	                    	en-KY	3580718	                    	\\r        	\N	\N
44	CF	CAF	140	CT	Central African Republic	Bangui	622984	4844927	AF	.cf	XAF	Franc               	236       	                    	                    	fr-CF,sg,ln,kg	239880	TD,SD,CD,SS,CM,CG   	\\r        	\N	\N
45	TD	TCD	148	CD	Chad	NDjamena	1284000	10543464	AF	.td	XAF	Franc               	235       	                    	                    	fr-TD,ar-TD,sre	2434508	NE,LY,CF,SD,CM,NG   	\\r        	\N	\N
46	CL	CHL	152	CI	Chile	Santiago	756950	16746491	SA	.cl	CLP	Peso                	56        	#######             	^(d{7})$            	es-CL	3895114	PE,BO,AR            	\\r        	\N	\N
47	CN	CHN	156	CH	China	Beijing	9596960	1330044000	AS	.cn	CNY	Yuan Renminbi       	86        	######              	^(d{6})$            	zh-CN,yue,wuu,dta,ug,za	1814991	LA,BT,TJ,KZ,MN,AF,NP	\\r        	\N	\N
48	CX	CXR	162	KT	Christmas Island	Flying Fish Cove	135	1500	AS	.cx	AUD	Dollar              	61        	####                	^(d{4})$            	en,zh,ms-CC	2078138	                    	\\r        	\N	\N
49	CC	CCK	166	CK	Cocos Islands	West Island	14	628	AS	.cc	AUD	Dollar              	61        	                    	                    	ms-CC,en	1547376	                    	\\r        	\N	\N
50	CO	COL	170	CO	Colombia	Bogota	1138910	44205293	SA	.co	COP	Peso                	57        	                    	                    	es-CO	3686110	EC,PE,PA,BR,VE      	\\r        	\N	\N
51	KM	COM	174	CN	Comoros	Moroni	2170	773407	AF	.km	KMF	Franc               	269       	                    	                    	ar,fr-KM	921929	                    	\\r        	\N	\N
52	CK	COK	184	CW	Cook Islands	Avarua	240	21388	OC	.ck	NZD	Dollar              	682       	                    	                    	en-CK,mi	1899402	                    	\\r        	\N	\N
53	CR	CRI	188	CS	Costa Rica	San Jose	51100	4516220	NA	.cr	CRC	Colon               	506       	####                	^(d{4})$            	es-CR,en	3624060	PA,NI               	\\r        	\N	\N
54	HR	HRV	191	HR	Croatia	Zagreb	56542	4491000	EU	.hr	HRK	Kuna                	385       	HR-#####            	^(?:HR)*(d{5})$     	hr-HR,sr	3202326	HU,SI,CS,BA,ME,RS   	\\r        	\N	\N
55	CU	CUB	192	CU	Cuba	Havana	110860	11423000	NA	.cu	CUP	Peso                	53        	CP #####            	^(?:CP)*(d{5})$     	es-CU	3562981	US                  	\\r        	\N	\N
56	CW	CUW	531	UC	Curacao	 Willemstad	0	141766	NA	.cw	ANG	Guilder             	599       	                    	                    	nl,pap	7626836	                    	\\r        	\N	\N
57	CY	CYP	196	CY	Cyprus	Nicosia	9250	1102677	EU	.cy	EUR	Euro                	357       	####                	^(d{4})$            	el-CY,tr-CY,en	146669	                    	\\r        	\N	\N
58	CZ	CZE	203	EZ	Czech Republic	Prague	78866	10476000	EU	.cz	CZK	Koruna              	420       	### ##              	^(d{5})$            	cs,sk	3077311	PL,DE,SK,AT         	\\r        	\N	\N
59	CD	COD	180	CG	Democratic Republic of the Congo	Kinshasa	2345410	70916439	AF	.cd	CDF	Franc               	243       	                    	                    	fr-CD,ln,kg	203312	TZ,CF,SS,RW,ZM,BI,UG	\\r        	\N	\N
60	DK	DNK	208	DA	Denmark	Copenhagen	43094	5484000	EU	.dk	DKK	Krone               	45        	####                	^(d{4})$            	da-DK,en,fo,de-DK	2623032	DE                  	\\r        	\N	\N
61	DJ	DJI	262	DJ	Djibouti	Djibouti	23000	740528	AF	.dj	DJF	Franc               	253       	                    	                    	fr-DJ,ar,so-DJ,aa	223816	ER,ET,SO            	\\r        	\N	\N
62	DM	DMA	212	DO	Dominica	Roseau	754	72813	NA	.dm	XCD	Dollar              	+1-767    	                    	                    	en-DM	3575830	                    	\\r        	\N	\N
63	DO	DOM	214	DR	Dominican Republic	Santo Domingo	48730	9823821	NA	.do	DOP	Peso                	+1-809 and	#####               	^(d{5})$            	es-DO	3508796	HT                  	\\r        	\N	\N
64	TL	TLS	626	TT	East Timor	Dili	15007	1154625	OC	.tl	USD	Dollar              	670       	                    	                    	tet,pt-TL,id,en	1966436	ID                  	\\r        	\N	\N
65	EC	ECU	218	EC	Ecuador	Quito	283560	14790608	SA	.ec	USD	Dollar              	593       	@####@              	^([a-zA-Z]d{4}[a-zA-	es-EC	3658394	PE,CO               	\\r        	\N	\N
66	EG	EGY	818	EG	Egypt	Cairo	1001450	80471869	AF	.eg	EGP	Pound               	20        	#####               	^(d{5})$            	ar-EG,en,fr	357994	LY,SD,IL            	\\r        	\N	\N
67	SV	SLV	222	ES	El Salvador	San Salvador	21040	6052064	NA	.sv	USD	Dollar              	503       	CP ####             	^(?:CP)*(d{4})$     	es-SV	3585968	GT,HN               	\\r        	\N	\N
68	GQ	GNQ	226	EK	Equatorial Guinea	Malabo	28051	1014999	AF	.gq	XAF	Franc               	240       	                    	                    	es-GQ,fr	2309096	GA,CM               	\\r        	\N	\N
69	ER	ERI	232	ER	Eritrea	Asmara	121320	5792984	AF	.er	ERN	Nakfa               	291       	                    	                    	aa-ER,ar,tig,kun,ti-ER	338010	ET,SD,DJ            	\\r        	\N	\N
70	EE	EST	233	EN	Estonia	Tallinn	45226	1291170	EU	.ee	EUR	Euro                	372       	#####               	^(d{5})$            	et,ru	453733	RU,LV               	\\r        	\N	\N
71	ET	ETH	231	ET	Ethiopia	Addis Ababa	1127127	88013491	AF	.et	ETB	Birr                	251       	####                	^(d{4})$            	am,en-ET,om-ET,ti-ET,so-ET,sid	337996	ER,KE,SD,SS,SO,DJ   	\\r        	\N	\N
72	FK	FLK	238	FK	Falkland Islands	Stanley	12173	2638	SA	.fk	FKP	Pound               	500       	                    	                    	en-FK	3474414	                    	\\r        	\N	\N
73	FO	FRO	234	FO	Faroe Islands	Torshavn	1399	48228	EU	.fo	DKK	Krone               	298       	FO-###              	^(?:FO)*(d{3})$     	fo,da-FO	2622320	                    	\\r        	\N	\N
74	FJ	FJI	242	FJ	Fiji	Suva	18270	875983	OC	.fj	FJD	Dollar              	679       	                    	                    	en-FJ,fj	2205218	                    	\\r        	\N	\N
75	FI	FIN	246	FI	Finland	Helsinki	337030	5244000	EU	.fi	EUR	Euro                	358       	#####               	^(?:FI)*(d{5})$     	fi-FI,sv-FI,smn	660013	NO,RU,SE            	\\r        	\N	\N
76	FR	FRA	250	FR	France	Paris	547030	64768389	EU	.fr	EUR	Euro                	33        	#####               	^(d{5})$            	fr-FR,frp,br,co,ca,eu,oc	3017382	CH,DE,BE,LU,IT,AD,MC	\\r        	\N	\N
77	GF	GUF	254	FG	French Guiana	Cayenne	91000	195506	SA	.gf	EUR	Euro                	594       	#####               	^((97)|(98)3d{2})$  	fr-GF	3381670	SR,BR               	\\r        	\N	\N
78	PF	PYF	258	FP	French Polynesia	Papeete	4167	270485	OC	.pf	XPF	Franc               	689       	#####               	^((97)|(98)7d{2})$  	fr-PF,ty	4030656	                    	\\r        	\N	\N
79	TF	ATF	260	FS	French Southern Territories	Port-aux-Francais	7829	140	AN	.tf	EUR	Euro                	          	                    	                    	fr	1546748	                    	\\r        	\N	\N
80	GA	GAB	266	GB	Gabon	Libreville	267667	1545255	AF	.ga	XAF	Franc               	241       	                    	                    	fr-GA	2400553	CM,GQ,CG            	\\r        	\N	\N
81	GM	GMB	270	GA	Gambia	Banjul	11300	1593256	AF	.gm	GMD	Dalasi              	220       	                    	                    	en-GM,mnk,wof,wo,ff	2413451	SN                  	\\r        	\N	\N
82	GE	GEO	268	GG	Georgia	Tbilisi	69700	4630000	AS	.ge	GEL	Lari                	995       	####                	^(d{4})$            	ka,ru,hy,az	614540	AM,AZ,TR,RU         	\\r        	\N	\N
83	DE	DEU	276	GM	Germany	Berlin	357021	81802257	EU	.de	EUR	Euro                	49        	#####               	^(d{5})$            	de	2921044	CH,PL,NL,DK,BE,CZ,LU	\\r        	\N	\N
84	GH	GHA	288	GH	Ghana	Accra	239460	24339838	AF	.gh	GHS	Cedi                	233       	                    	                    	en-GH,ak,ee,tw	2300660	CI,TG,BF            	\\r        	\N	\N
85	GI	GIB	292	GI	Gibraltar	Gibraltar	6.5	27884	EU	.gi	GIP	Pound               	350       	                    	                    	en-GI,es,it,pt	2411586	ES                  	\\r        	\N	\N
86	GR	GRC	300	GR	Greece	Athens	131940	11000000	EU	.gr	EUR	Euro                	30        	### ##              	^(d{5})$            	el-GR,en,fr	390903	AL,MK,TR,BG         	\\r        	\N	\N
87	GL	GRL	304	GL	Greenland	Nuuk	2166086	56375	NA	.gl	DKK	Krone               	299       	####                	^(d{4})$            	kl,da-GL,en	3425505	                    	\\r        	\N	\N
88	GD	GRD	308	GJ	Grenada	St. Georges	344	107818	NA	.gd	XCD	Dollar              	+1-473    	                    	                    	en-GD	3580239	                    	\\r        	\N	\N
89	GP	GLP	312	GP	Guadeloupe	Basse-Terre	1780	443000	NA	.gp	EUR	Euro                	590       	#####               	^((97)|(98)d{3})$   	fr-GP	3579143	AN                  	\\r        	\N	\N
90	GU	GUM	316	GQ	Guam	Hagatna	549	159358	OC	.gu	USD	Dollar              	+1-671    	969##               	^(969d{2})$         	en-GU,ch-GU	4043988	                    	\\r        	\N	\N
91	GT	GTM	320	GT	Guatemala	Guatemala City	108890	13550440	NA	.gt	GTQ	Quetzal             	502       	#####               	^(d{5})$            	es-GT	3595528	MX,HN,BZ,SV         	\\r        	\N	\N
92	GG	GGY	831	GK	Guernsey	St Peter Port	78	65228	EU	.gg	GBP	Pound               	+44-1481  	@# #@@|@## #@@|@@# #	^(([A-Z]d{2}[A-Z]{2}	en,fr	3042362	                    	\\r        	\N	\N
93	GN	GIN	324	GV	Guinea	Conakry	245857	10324025	AF	.gn	GNF	Franc               	224       	                    	                    	fr-GN	2420477	LR,SN,SL,CI,GW,ML   	\\r        	\N	\N
94	GW	GNB	624	PU	Guinea-Bissau	Bissau	36120	1565126	AF	.gw	XOF	Franc               	245       	####                	^(d{4})$            	pt-GW,pov	2372248	SN,GN               	\\r        	\N	\N
95	GY	GUY	328	GY	Guyana	Georgetown	214970	748486	SA	.gy	GYD	Dollar              	592       	                    	                    	en-GY	3378535	SR,BR,VE            	\\r        	\N	\N
96	HT	HTI	332	HA	Haiti	Port-au-Prince	27750	9648924	NA	.ht	HTG	Gourde              	509       	HT####              	^(?:HT)*(d{4})$     	ht,fr-HT	3723988	DO                  	\\r        	\N	\N
97	HM	HMD	334	HM	Heard Island and McDonald Islands		412	0	AN	.hm	AUD	Dollar              	          	                    	                    		1547314	                    	\\r        	\N	\N
98	HN	HND	340	HO	Honduras	Tegucigalpa	112090	7989415	NA	.hn	HNL	Lempira             	504       	@@####              	^([A-Z]{2}d{4})$    	es-HN	3608932	GT,NI,SV            	\\r        	\N	\N
99	HK	HKG	344	HK	Hong Kong	Hong Kong	1092	6898686	AS	.hk	HKD	Dollar              	852       	                    	                    	zh-HK,yue,zh,en	1819730	                    	\\r        	\N	\N
100	HU	HUN	348	HU	Hungary	Budapest	93030	9930000	EU	.hu	HUF	Forint              	36        	####                	^(d{4})$            	hu-HU	719819	SK,SI,RO,UA,CS,HR,AT	\\r        	\N	\N
101	IS	ISL	352	IC	Iceland	Reykjavik	103000	308910	EU	.is	ISK	Krona               	354       	###                 	^(d{3})$            	is,en,de,da,sv,no	2629691	                    	\\r        	\N	\N
102	IN	IND	356	IN	India	New Delhi	3287590	1173108018	AS	.in	INR	Rupee               	91        	######              	^(d{6})$            	en-IN,hi,bn,te,mr,ta,ur,gu,kn,ml,or,pa,as,bh,sat,ks,ne,sd,kok,doi,mni,sit,sa,fr,lus,inc	1269750	CN,NP,MM,BT,PK,BD   	\\r        	\N	\N
103	ID	IDN	360	ID	Indonesia	Jakarta	1919440	242968342	AS	.id	IDR	Rupiah              	62        	#####               	^(d{5})$            	id,en,nl,jv	1643084	PG,TL,MY            	\\r        	\N	\N
104	IR	IRN	364	IR	Iran	Tehran	1648000	76923300	AS	.ir	IRR	Rial                	98        	##########          	^(d{10})$           	fa-IR,ku	130758	TM,AF,IQ,AM,PK,AZ,TR	\\r        	\N	\N
105	IQ	IRQ	368	IZ	Iraq	Baghdad	437072	29671605	AS	.iq	IQD	Dinar               	964       	#####               	^(d{5})$            	ar-IQ,ku,hy	99237	SY,SA,IR,JO,TR,KW   	\\r        	\N	\N
106	IE	IRL	372	EI	Ireland	Dublin	70280	4622917	EU	.ie	EUR	Euro                	353       	                    	                    	en-IE,ga-IE	2963597	GB                  	\\r        	\N	\N
143	MX	MEX	484	MX	Mexico	Mexico City	1972550	112468855	NA	.mx	MXN	Peso                	52        	#####               	^(d{5})$            	es-MX	3996063	GT,US,BZ            	\\r        	\N	\N
107	IM	IMN	833	IM	Isle of Man	Douglas, Isle of Man	572	75049	EU	.im	GBP	Pound               	+44-1624  	@# #@@|@## #@@|@@# #	^(([A-Z]d{2}[A-Z]{2}	en,gv	3042225	                    	\\r        	\N	\N
108	IL	ISR	376	IS	Israel	Jerusalem	20770	7353985	AS	.il	ILS	Shekel              	972       	#####               	^(d{5})$            	he,ar-IL,en-IL,	294640	SY,JO,LB,EG,PS      	\\r        	\N	\N
109	IT	ITA	380	IT	Italy	Rome	301230	60340328	EU	.it	EUR	Euro                	39        	#####               	^(d{5})$            	it-IT,de-IT,fr-IT,sc,ca,co,sl	3175395	CH,VA,SI,SM,FR,AT   	\\r        	\N	\N
110	CI	CIV	384	IV	Ivory Coast	Yamoussoukro	322460	21058798	AF	.ci	XOF	Franc               	225       	                    	                    	fr-CI	2287781	LR,GH,GN,BF,ML      	\\r        	\N	\N
111	JM	JAM	388	JM	Jamaica	Kingston	10991	2847232	NA	.jm	JMD	Dollar              	+1-876    	                    	                    	en-JM	3489940	                    	\\r        	\N	\N
112	JP	JPN	392	JA	Japan	Tokyo	377835	127288000	AS	.jp	JPY	Yen                 	81        	###-####            	^(d{7})$            	ja	1861060	                    	\\r        	\N	\N
113	JE	JEY	832	JE	Jersey	Saint Helier	116	90812	EU	.je	GBP	Pound               	+44-1534  	@# #@@|@## #@@|@@# #	^(([A-Z]d{2}[A-Z]{2}	en,pt	3042142	                    	\\r        	\N	\N
114	JO	JOR	400	JO	Jordan	Amman	92300	6407085	AS	.jo	JOD	Dinar               	962       	#####               	^(d{5})$            	ar-JO,en	248816	SY,SA,IQ,IL,PS      	\\r        	\N	\N
115	KZ	KAZ	398	KZ	Kazakhstan	Astana	2717300	15340000	AS	.kz	KZT	Tenge               	7         	######              	^(d{6})$            	kk,ru	1522867	TM,CN,KG,UZ,RU      	\\r        	\N	\N
116	KE	KEN	404	KE	Kenya	Nairobi	582650	40046566	AF	.ke	KES	Shilling            	254       	#####               	^(d{5})$            	en-KE,sw-KE	192950	ET,TZ,SS,SO,UG      	\\r        	\N	\N
117	KI	KIR	296	KR	Kiribati	Tarawa	811	92533	OC	.ki	AUD	Dollar              	686       	                    	                    	en-KI,gil	4030945	                    	\\r        	\N	\N
118	XK	XKX	0	KV	Kosovo	Pristina	0	1800000	EU	   	EUR	Euro                	          	                    	                    	sq,sr	831053	RS,AL,MK,ME         	\\r        	\N	\N
119	KW	KWT	414	KU	Kuwait	Kuwait City	17820	2789132	AS	.kw	KWD	Dinar               	965       	#####               	^(d{5})$            	ar-KW,en	285570	SA,IQ               	\\r        	\N	\N
120	KG	KGZ	417	KG	Kyrgyzstan	Bishkek	198500	5508626	AS	.kg	KGS	Som                 	996       	######              	^(d{6})$            	ky,uz,ru	1527747	CN,TJ,UZ,KZ         	\\r        	\N	\N
121	LA	LAO	418	LA	Laos	Vientiane	236800	6368162	AS	.la	LAK	Kip                 	856       	#####               	^(d{5})$            	lo,fr,en	1655842	CN,MM,KH,TH,VN      	\\r        	\N	\N
122	LV	LVA	428	LG	Latvia	Riga	64589	2217969	EU	.lv	LVL	Lat                 	371       	LV-####             	^(?:LV)*(d{4})$     	lv,ru,lt	458258	LT,EE,BY,RU         	\\r        	\N	\N
123	LB	LBN	422	LE	Lebanon	Beirut	10400	4125247	AS	.lb	LBP	Pound               	961       	#### ####|####      	^(d{4}(d{4})?)$     	ar-LB,fr-LB,en,hy	272103	SY,IL               	\\r        	\N	\N
124	LS	LSO	426	LT	Lesotho	Maseru	30355	1919552	AF	.ls	LSL	Loti                	266       	###                 	^(d{3})$            	en-LS,st,zu,xh	932692	ZA                  	\\r        	\N	\N
125	LR	LBR	430	LI	Liberia	Monrovia	111370	3685076	AF	.lr	LRD	Dollar              	231       	####                	^(d{4})$            	en-LR	2275384	SL,CI,GN            	\\r        	\N	\N
126	LY	LBY	434	LY	Libya	Tripolis	1759540	6461454	AF	.ly	LYD	Dinar               	218       	                    	                    	ar-LY,it,en	2215636	TD,NE,DZ,SD,TN,EG   	\\r        	\N	\N
127	LI	LIE	438	LS	Liechtenstein	Vaduz	160	35000	EU	.li	CHF	Franc               	423       	####                	^(d{4})$            	de-LI	3042058	CH,AT               	\\r        	\N	\N
128	LT	LTU	440	LH	Lithuania	Vilnius	65200	3565000	EU	.lt	LTL	Litas               	370       	LT-#####            	^(?:LT)*(d{5})$     	lt,ru,pl	597427	PL,BY,RU,LV         	\\r        	\N	\N
129	LU	LUX	442	LU	Luxembourg	Luxembourg	2586	497538	EU	.lu	EUR	Euro                	352       	####                	^(d{4})$            	lb,de-LU,fr-LU	2960313	DE,BE,FR            	\\r        	\N	\N
130	MO	MAC	446	MC	Macao	Macao	254	449198	AS	.mo	MOP	Pataca              	853       	                    	                    	zh,zh-MO,pt	1821275	                    	\\r        	\N	\N
131	MK	MKD	807	MK	Macedonia	Skopje	25333	2061000	EU	.mk	MKD	Denar               	389       	####                	^(d{4})$            	mk,sq,tr,rmm,sr	718075	AL,GR,CS,BG,RS,XK   	\\r        	\N	\N
132	MG	MDG	450	MA	Madagascar	Antananarivo	587040	21281844	AF	.mg	MGA	Ariary              	261       	###                 	^(d{3})$            	fr-MG,mg	1062947	                    	\\r        	\N	\N
133	MW	MWI	454	MI	Malawi	Lilongwe	118480	15447500	AF	.mw	MWK	Kwacha              	265       	                    	                    	ny,yao,tum,swk	927384	TZ,MZ,ZM            	\\r        	\N	\N
134	MY	MYS	458	MY	Malaysia	Kuala Lumpur	329750	28274729	AS	.my	MYR	Ringgit             	60        	#####               	^(d{5})$            	ms-MY,en,zh,ta,te,ml,pa,th	1733045	BN,TH,ID            	\\r        	\N	\N
135	MV	MDV	462	MV	Maldives	Male	300	395650	AS	.mv	MVR	Rufiyaa             	960       	#####               	^(d{5})$            	dv,en	1282028	                    	\\r        	\N	\N
136	ML	MLI	466	ML	Mali	Bamako	1240000	13796354	AF	.ml	XOF	Franc               	223       	                    	                    	fr-ML,bm	2453866	SN,NE,DZ,CI,GN,MR,BF	\\r        	\N	\N
137	MT	MLT	470	MT	Malta	Valletta	316	403000	EU	.mt	EUR	Euro                	356       	@@@ ###|@@@ ##      	^([A-Z]{3}d{2}d?)$  	mt,en-MT	2562770	                    	\\r        	\N	\N
138	MH	MHL	584	RM	Marshall Islands	Majuro	181.300000000000011	65859	OC	.mh	USD	Dollar              	692       	                    	                    	mh,en-MH	2080185	                    	\\r        	\N	\N
139	MQ	MTQ	474	MB	Martinique	Fort-de-France	1100	432900	NA	.mq	EUR	Euro                	596       	#####               	^(d{5})$            	fr-MQ	3570311	                    	\\r        	\N	\N
140	MR	MRT	478	MR	Mauritania	Nouakchott	1030700	3205060	AF	.mr	MRO	Ouguiya             	222       	                    	                    	ar-MR,fuc,snk,fr,mey,wo	2378080	SN,DZ,EH,ML         	\\r        	\N	\N
141	MU	MUS	480	MP	Mauritius	Port Louis	2040	1294104	AF	.mu	MUR	Rupee               	230       	                    	                    	en-MU,bho,fr	934292	                    	\\r        	\N	\N
142	YT	MYT	175	MF	Mayotte	Mamoudzou	374	159042	AF	.yt	EUR	Euro                	262       	#####               	^(d{5})$            	fr-YT	1024031	                    	\\r        	\N	\N
144	FM	FSM	583	FM	Micronesia	Palikir	702	107708	OC	.fm	USD	Dollar              	691       	#####               	^(d{5})$            	en-FM,chk,pon,yap,kos,uli,woe,nkr,kpg	2081918	                    	\\r        	\N	\N
145	MD	MDA	498	MD	Moldova	Chisinau	33843	4324000	EU	.md	MDL	Leu                 	373       	MD-####             	^(?:MD)*(d{4})$     	ro,ru,gag,tr	617790	RO,UA               	\\r        	\N	\N
146	MC	MCO	492	MN	Monaco	Monaco	1.94999999999999996	32965	EU	.mc	EUR	Euro                	377       	#####               	^(d{5})$            	fr-MC,en,it	2993457	FR                  	\\r        	\N	\N
147	MN	MNG	496	MG	Mongolia	Ulan Bator	1565000	3086918	AS	.mn	MNT	Tugrik              	976       	######              	^(d{6})$            	mn,ru	2029969	CN,RU               	\\r        	\N	\N
148	ME	MNE	499	MJ	Montenegro	Podgorica	14026	666730	EU	.me	EUR	Euro                	382       	#####               	^(d{5})$            	sr,hu,bs,sq,hr,rom	3194884	AL,HR,BA,RS,XK      	\\r        	\N	\N
149	MS	MSR	500	MH	Montserrat	Plymouth	102	9341	NA	.ms	XCD	Dollar              	+1-664    	                    	                    	en-MS	3578097	                    	\\r        	\N	\N
150	MA	MAR	504	MO	Morocco	Rabat	446550	31627428	AF	.ma	MAD	Dirham              	212       	#####               	^(d{5})$            	ar-MA,fr	2542007	DZ,EH,ES            	\\r        	\N	\N
151	MZ	MOZ	508	MZ	Mozambique	Maputo	801590	22061451	AF	.mz	MZN	Metical             	258       	####                	^(d{4})$            	pt-MZ,vmw	1036973	ZW,TZ,SZ,ZA,ZM,MW   	\\r        	\N	\N
152	MM	MMR	104	BM	Myanmar	Nay Pyi Taw	678500	53414374	AS	.mm	MMK	Kyat                	95        	#####               	^(d{5})$            	my	1327865	CN,LA,TH,BD,IN      	\\r        	\N	\N
153	NA	NAM	516	WA	Namibia	Windhoek	825418	2128471	AF	.na	NAD	Dollar              	264       	                    	                    	en-NA,af,de,hz,naq	3355338	ZA,BW,ZM,AO         	\\r        	\N	\N
154	NR	NRU	520	NR	Nauru	Yaren	21	10065	OC	.nr	AUD	Dollar              	674       	                    	                    	na,en-NR	2110425	                    	\\r        	\N	\N
155	NP	NPL	524	NP	Nepal	Kathmandu	140800	28951852	AS	.np	NPR	Rupee               	977       	#####               	^(d{5})$            	ne,en	1282988	CN,IN               	\\r        	\N	\N
156	NL	NLD	528	NL	Netherlands	Amsterdam	41526	16645000	EU	.nl	EUR	Euro                	31        	#### @@             	^(d{4}[A-Z]{2})$    	nl-NL,fy-NL	2750405	DE,BE               	\\r        	\N	\N
157	AN	ANT	530	NT	Netherlands Antilles	Willemstad	960	136197	NA	.an	ANG	Guilder             	599       	                    	                    	nl-AN,en,es	0	GP                  	\\r        	\N	\N
158	NC	NCL	540	NC	New Caledonia	Noumea	19060	216494	OC	.nc	XPF	Franc               	687       	#####               	^(d{5})$            	fr-NC	2139685	                    	\\r        	\N	\N
159	NZ	NZL	554	NZ	New Zealand	Wellington	268680	4252277	OC	.nz	NZD	Dollar              	64        	####                	^(d{4})$            	en-NZ,mi	2186224	                    	\\r        	\N	\N
160	NI	NIC	558	NU	Nicaragua	Managua	129494	5995928	NA	.ni	NIO	Cordoba             	505       	###-###-#           	^(d{7})$            	es-NI,en	3617476	CR,HN               	\\r        	\N	\N
161	NE	NER	562	NG	Niger	Niamey	1267000	15878271	AF	.ne	XOF	Franc               	227       	####                	^(d{4})$            	fr-NE,ha,kr,dje	2440476	TD,BJ,DZ,LY,BF,NG,ML	\\r        	\N	\N
162	NG	NGA	566	NI	Nigeria	Abuja	923768	154000000	AF	.ng	NGN	Naira               	234       	######              	^(d{6})$            	en-NG,ha,yo,ig,ff	2328926	TD,NE,BJ,CM         	\\r        	\N	\N
163	NU	NIU	570	NE	Niue	Alofi	260	2166	OC	.nu	NZD	Dollar              	683       	                    	                    	niu,en-NU	4036232	                    	\\r        	\N	\N
164	NF	NFK	574	NF	Norfolk Island	Kingston	34.6000000000000014	1828	OC	.nf	AUD	Dollar              	672       	                    	                    	en-NF	2155115	                    	\\r        	\N	\N
165	KP	PRK	408	KN	North Korea	Pyongyang	120540	22912177	AS	.kp	KPW	Won                 	850       	###-###             	^(d{6})$            	ko-KP	1873107	CN,KR,RU            	\\r        	\N	\N
166	MP	MNP	580	CQ	Northern Mariana Islands	Saipan	477	53883	OC	.mp	USD	Dollar              	+1-670    	                    	                    	fil,tl,zh,ch-MP,en-MP	4041468	                    	\\r        	\N	\N
167	NO	NOR	578	NO	Norway	Oslo	324220	4985870	EU	.no	NOK	Krone               	47        	####                	^(d{4})$            	no,nb,nn,se,fi	3144096	FI,RU,SE            	\\r        	\N	\N
168	OM	OMN	512	MU	Oman	Muscat	212460	2967717	AS	.om	OMR	Rial                	968       	###                 	^(d{3})$            	ar-OM,en,bal,ur	286963	SA,YE,AE            	\\r        	\N	\N
169	PK	PAK	586	PK	Pakistan	Islamabad	803940	184404791	AS	.pk	PKR	Rupee               	92        	#####               	^(d{5})$            	ur-PK,en-PK,pa,sd,ps,brh	1168579	CN,AF,IR,IN         	\\r        	\N	\N
170	PW	PLW	585	PS	Palau	Melekeok	458	19907	OC	.pw	USD	Dollar              	680       	96940               	^(96940)$           	pau,sov,en-PW,tox,ja,fil,zh	1559582	                    	\\r        	\N	\N
171	PS	PSE	275	WE	Palestinian Territory	East Jerusalem	5970	3800000	AS	.ps	ILS	Shekel              	970       	                    	                    	ar-PS	6254930	JO,IL               	\\r        	\N	\N
172	PA	PAN	591	PM	Panama	Panama City	78200	3410676	NA	.pa	PAB	Balboa              	507       	                    	                    	es-PA,en	3703430	CR,CO               	\\r        	\N	\N
173	PG	PNG	598	PP	Papua New Guinea	Port Moresby	462840	6064515	OC	.pg	PGK	Kina                	675       	###                 	^(d{3})$            	en-PG,ho,meu,tpi	2088628	ID                  	\\r        	\N	\N
174	PY	PRY	600	PA	Paraguay	Asuncion	406750	6375830	SA	.py	PYG	Guarani             	595       	####                	^(d{4})$            	es-PY,gn	3437598	BO,BR,AR            	\\r        	\N	\N
175	PE	PER	604	PE	Peru	Lima	1285220	29907003	SA	.pe	PEN	Sol                 	51        	                    	                    	es-PE,qu,ay	3932488	EC,CL,BO,BR,CO      	\\r        	\N	\N
176	PH	PHL	608	RP	Philippines	Manila	300000	99900177	AS	.ph	PHP	Peso                	63        	####                	^(d{4})$            	tl,en-PH,fil	1694008	                    	\\r        	\N	\N
177	PN	PCN	612	PC	Pitcairn	Adamstown	47	46	OC	.pn	NZD	Dollar              	870       	                    	                    	en-PN	4030699	                    	\\r        	\N	\N
178	PL	POL	616	PL	Poland	Warsaw	312685	38500000	EU	.pl	PLN	Zloty               	48        	##-###              	^(d{5})$            	pl	798544	DE,LT,SK,CZ,BY,UA,RU	\\r        	\N	\N
179	PT	PRT	620	PO	Portugal	Lisbon	92391	10676000	EU	.pt	EUR	Euro                	351       	####-###            	^(d{7})$            	pt-PT,mwl	2264397	ES                  	\\r        	\N	\N
180	PR	PRI	630	RQ	Puerto Rico	San Juan	9104	3916632	NA	.pr	USD	Dollar              	+1-787 and	#####-####          	^(d{9})$            	en-PR,es-PR	4566966	                    	\\r        	\N	\N
181	QA	QAT	634	QA	Qatar	Doha	11437	840926	AS	.qa	QAR	Rial                	974       	                    	                    	ar-QA,es	289688	SA                  	\\r        	\N	\N
182	CG	COG	178	CF	Republic of the Congo	Brazzaville	342000	3039126	AF	.cg	XAF	Franc               	242       	                    	                    	fr-CG,kg,ln-CG	2260494	CF,GA,CD,CM,AO      	\\r        	\N	\N
183	RE	REU	638	RE	Reunion	Saint-Denis	2517	776948	AF	.re	EUR	Euro                	262       	#####               	^((97)|(98)(4|7|8)d{	fr-RE	935317	                    	\\r        	\N	\N
184	RO	ROU	642	RO	Romania	Bucharest	237500	21959278	EU	.ro	RON	Leu                 	40        	######              	^(d{6})$            	ro,hu,rom	798549	MD,HU,UA,CS,BG,RS   	\\r        	\N	\N
185	RU	RUS	643	RS	Russia	Moscow	17100000	140702000	EU	.ru	RUB	Ruble               	7         	######              	^(d{6})$            	ru,tt,xal,cau,ady,kv,ce,tyv,cv,udm,tut,mns,bua,myv,mdf,chm,ba,inh,tut,kbd,krc,ava,sah,nog	2017370	GE,CN,BY,UA,KZ,LV,PL	\\r        	\N	\N
186	RW	RWA	646	RW	Rwanda	Kigali	26338	11055976	AF	.rw	RWF	Franc               	250       	                    	                    	rw,en-RW,fr-RW,sw	49518	TZ,CD,BI,UG         	\\r        	\N	\N
187	BL	BLM	652	TB	Saint Barthelemy	Gustavia	21	8450	NA	.gp	EUR	Euro                	590       	### ###             	                    	fr	3578476	                    	\\r        	\N	\N
188	SH	SHN	654	SH	Saint Helena	Jamestown	410	7460	AF	.sh	SHP	Pound               	290       	STHL 1ZZ            	^(STHL1ZZ)$         	en-SH	3370751	                    	\\r        	\N	\N
189	KN	KNA	659	SC	Saint Kitts and Nevis	Basseterre	261	49898	NA	.kn	XCD	Dollar              	+1-869    	                    	                    	en-KN	3575174	                    	\\r        	\N	\N
190	LC	LCA	662	ST	Saint Lucia	Castries	616	160922	NA	.lc	XCD	Dollar              	+1-758    	                    	                    	en-LC	3576468	                    	\\r        	\N	\N
191	MF	MAF	663	RN	Saint Martin	Marigot	53	35925	NA	.gp	EUR	Euro                	590       	### ###             	                    	fr	3578421	SX                  	\\r        	\N	\N
192	PM	SPM	666	SB	Saint Pierre and Miquelon	Saint-Pierre	242	7012	NA	.pm	EUR	Euro                	508       	#####               	^(97500)$           	fr-PM	3424932	                    	\\r        	\N	\N
193	VC	VCT	670	VC	Saint Vincent and the Grenadines	Kingstown	389	104217	NA	.vc	XCD	Dollar              	+1-784    	                    	                    	en-VC,fr	3577815	                    	\\r        	\N	\N
194	WS	WSM	882	WS	Samoa	Apia	2944	192001	OC	.ws	WST	Tala                	685       	                    	                    	sm,en-WS	4034894	                    	\\r        	\N	\N
195	SM	SMR	674	SM	San Marino	San Marino	61.2000000000000028	31477	EU	.sm	EUR	Euro                	378       	4789#               	^(4789d)$           	it-SM	3168068	IT                  	\\r        	\N	\N
196	ST	STP	678	TP	Sao Tome and Principe	Sao Tome	1001	175808	AF	.st	STD	Dobra               	239       	                    	                    	pt-ST	2410758	                    	\\r        	\N	\N
197	SA	SAU	682	SA	Saudi Arabia	Riyadh	1960582	25731776	AS	.sa	SAR	Rial                	966       	#####               	^(d{5})$            	ar-SA	102358	QA,OM,IQ,YE,JO,AE,KW	\\r        	\N	\N
198	SN	SEN	686	SG	Senegal	Dakar	196190	12323252	AF	.sn	XOF	Franc               	221       	#####               	^(d{5})$            	fr-SN,wo,fuc,mnk	2245662	GN,MR,GW,GM,ML      	\\r        	\N	\N
199	RS	SRB	688	RI	Serbia	Belgrade	88361	7344847	EU	.rs	RSD	Dinar               	381       	######              	^(d{6})$            	sr,hu,bs,rom	6290252	AL,HU,MK,RO,HR,BA,BG	\\r        	\N	\N
200	CS	SCG	891	YI	Serbia and Montenegro	Belgrade	102350	10829175	EU	.cs	RSD	Dinar               	381       	#####               	^(d{5})$            	cu,hu,sq,sr	0	AL,HU,MK,RO,HR,BA,BG	\\r        	\N	\N
201	SC	SYC	690	SE	Seychelles	Victoria	455	88340	AF	.sc	SCR	Rupee               	248       	                    	                    	en-SC,fr-SC	241170	                    	\\r        	\N	\N
202	SL	SLE	694	SL	Sierra Leone	Freetown	71740	5245695	AF	.sl	SLL	Leone               	232       	                    	                    	en-SL,men,tem	2403846	LR,GN               	\\r        	\N	\N
203	SG	SGP	702	SN	Singapore	Singapur	692.700000000000045	4701069	AS	.sg	SGD	Dollar              	65        	######              	^(d{6})$            	cmn,en-SG,ms-SG,ta-SG,zh-SG	1880251	                    	\\r        	\N	\N
204	SX	SXM	534	NN	Sint Maarten	Philipsburg	0	37429	NA	.sx	ANG	Guilder             	599       	                    	                    	nl,en	7609695	MF                  	\\r        	\N	\N
205	SK	SVK	703	LO	Slovakia	Bratislava	48845	5455000	EU	.sk	EUR	Euro                	421       	###  ##             	^(d{5})$            	sk,hu	3057568	PL,HU,CZ,UA,AT      	\\r        	\N	\N
206	SI	SVN	705	SI	Slovenia	Ljubljana	20273	2007000	EU	.si	EUR	Euro                	386       	SI- ####            	^(?:SI)*(d{4})$     	sl,sh	3190538	HU,IT,HR,AT         	\\r        	\N	\N
207	SB	SLB	90	BP	Solomon Islands	Honiara	28450	559198	OC	.sb	SBD	Dollar              	677       	                    	                    	en-SB,tpi	2103350	                    	\\r        	\N	\N
208	SO	SOM	706	SO	Somalia	Mogadishu	637657	10112453	AF	.so	SOS	Shilling            	252       	@@  #####           	^([A-Z]{2}d{5})$    	so-SO,ar-SO,it,en-SO	51537	ET,KE,DJ            	\\r        	\N	\N
209	ZA	ZAF	710	SF	South Africa	Pretoria	1219912	49000000	AF	.za	ZAR	Rand                	27        	####                	^(d{4})$            	zu,xh,af,nso,en-ZA,tn,st,ts,ss,ve,nr	953987	ZW,SZ,MZ,BW,NA,LS   	\\r        	\N	\N
210	GS	SGS	239	SX	South Georgia and the South Sandwich Islands	Grytviken	3903	30	AN	.gs	GBP	Pound               	          	                    	                    	en	3474415	                    	\\r        	\N	\N
211	KR	KOR	410	KS	South Korea	Seoul	98480	48422644	AS	.kr	KRW	Won                 	82        	SEOUL ###-###       	^(?:SEOUL)*(d{6})$  	ko-KR,en	1835841	KP                  	\\r        	\N	\N
212	SS	SSD	728	OD	South Sudan	Juba	644329	8260490	AF	   	SSP	Pound               	211       	                    	                    	en	7909807	CD,CF,ET,KE,SD,UG,  	\\r        	\N	\N
213	ES	ESP	724	SP	Spain	Madrid	504782	46505963	EU	.es	EUR	Euro                	34        	#####               	^(d{5})$            	es-ES,ca,gl,eu,oc	2510769	AD,PT,GI,FR,MA      	\\r        	\N	\N
214	LK	LKA	144	CE	Sri Lanka	Colombo	65610	21513990	AS	.lk	LKR	Rupee               	94        	#####               	^(d{5})$            	si,ta,en	1227603	                    	\\r        	\N	\N
215	SD	SDN	729	SU	Sudan	Khartoum	1861484	35000000	AF	.sd	SDG	Pound               	249       	#####               	^(d{5})$            	ar-SD,en,fia	366755	SS,TD,EG,ET,ER,LY,CF	\\r        	\N	\N
216	SR	SUR	740	NS	Suriname	Paramaribo	163270	492829	SA	.sr	SRD	Dollar              	597       	                    	                    	nl-SR,en,srn,hns,jv	3382998	GY,BR,GF            	\\r        	\N	\N
217	SJ	SJM	744	SV	Svalbard and Jan Mayen	Longyearbyen	62049	2550	EU	.sj	NOK	Krone               	47        	                    	                    	no,ru	607072	                    	\\r        	\N	\N
218	SZ	SWZ	748	WZ	Swaziland	Mbabane	17363	1354051	AF	.sz	SZL	Lilangeni           	268       	@###                	^([A-Z]d{3})$       	en-SZ,ss-SZ	934841	ZA,MZ               	\\r        	\N	\N
219	SE	SWE	752	SW	Sweden	Stockholm	449964	9045000	EU	.se	SEK	Krona               	46        	SE-### ##           	^(?:SE)*(d{5})$     	sv-SE,se,sma,fi-SE	2661886	NO,FI               	\\r        	\N	\N
220	CH	CHE	756	SZ	Switzerland	Berne	41290	7581000	EU	.ch	CHF	Franc               	41        	####                	^(d{4})$            	de-CH,fr-CH,it-CH,rm	2658434	DE,IT,LI,FR,AT      	\\r        	\N	\N
221	SY	SYR	760	SY	Syria	Damascus	185180	22198110	AS	.sy	SYP	Pound               	963       	                    	                    	ar-SY,ku,hy,arc,fr,en	163843	IQ,JO,IL,TR,LB      	\\r        	\N	\N
222	TW	TWN	158	TW	Taiwan	Taipei	35980	22894384	AS	.tw	TWD	Dollar              	886       	#####               	^(d{5})$            	zh-TW,zh,nan,hak	1668284	                    	\\r        	\N	\N
223	TJ	TJK	762	TI	Tajikistan	Dushanbe	143100	7487489	AS	.tj	TJS	Somoni              	992       	######              	^(d{6})$            	tg,ru	1220409	CN,AF,KG,UZ         	\\r        	\N	\N
224	TZ	TZA	834	TZ	Tanzania	Dodoma	945087	41892895	AF	.tz	TZS	Shilling            	255       	                    	                    	sw-TZ,en,ar	149590	MZ,KE,CD,RW,ZM,BI,UG	\\r        	\N	\N
225	TH	THA	764	TH	Thailand	Bangkok	514000	67089500	AS	.th	THB	Baht                	66        	#####               	^(d{5})$            	th,en	1605651	LA,MM,KH,MY         	\\r        	\N	\N
226	TG	TGO	768	TO	Togo	Lome	56785	6587239	AF	.tg	XOF	Franc               	228       	                    	                    	fr-TG,ee,hna,kbp,dag,ha	2363686	BJ,GH,BF            	\\r        	\N	\N
227	TK	TKL	772	TL	Tokelau		10	1466	OC	.tk	NZD	Dollar              	690       	                    	                    	tkl,en-TK	4031074	                    	\\r        	\N	\N
228	TO	TON	776	TN	Tonga	Nukualofa	748	122580	OC	.to	TOP	Paanga              	676       	                    	                    	to,en-TO	4032283	                    	\\r        	\N	\N
229	TT	TTO	780	TD	Trinidad and Tobago	Port of Spain	5128	1228691	NA	.tt	TTD	Dollar              	+1-868    	                    	                    	en-TT,hns,fr,es,zh	3573591	                    	\\r        	\N	\N
230	TN	TUN	788	TS	Tunisia	Tunis	163610	10589025	AF	.tn	TND	Dinar               	216       	####                	^(d{4})$            	ar-TN,fr	2464461	DZ,LY               	\\r        	\N	\N
231	TR	TUR	792	TU	Turkey	Ankara	780580	77804122	AS	.tr	TRY	Lira                	90        	#####               	^(d{5})$            	tr-TR,ku,diq,az,av	298795	SY,GE,IQ,IR,GR,AM,AZ	\\r        	\N	\N
232	TM	TKM	795	TX	Turkmenistan	Ashgabat	488100	4940916	AS	.tm	TMT	Manat               	993       	######              	^(d{6})$            	tk,ru,uz	1218197	AF,IR,UZ,KZ         	\\r        	\N	\N
233	TC	TCA	796	TK	Turks and Caicos Islands	Cockburn Town	430	20556	NA	.tc	USD	Dollar              	+1-649    	TKCA 1ZZ            	^(TKCA 1ZZ)$        	en-TC	3576916	                    	\\r        	\N	\N
234	TV	TUV	798	TV	Tuvalu	Funafuti	26	10472	OC	.tv	AUD	Dollar              	688       	                    	                    	tvl,en,sm,gil	2110297	                    	\\r        	\N	\N
235	VI	VIR	850	VQ	U.S. Virgin Islands	Charlotte Amalie	352	108708	NA	.vi	USD	Dollar              	+1-340    	                    	                    	en-VI	4796775	                    	\\r        	\N	\N
236	UG	UGA	800	UG	Uganda	Kampala	236040	33398682	AF	.ug	UGX	Shilling            	256       	                    	                    	en-UG,lg,sw,ar	226074	TZ,KE,SS,CD,RW      	\\r        	\N	\N
237	UA	UKR	804	UP	Ukraine	Kiev	603700	45415596	EU	.ua	UAH	Hryvnia             	380       	#####               	^(d{5})$            	uk,ru-UA,rom,pl,hu	690791	PL,MD,HU,SK,BY,RO,RU	\\r        	\N	\N
238	AE	ARE	784	AE	United Arab Emirates	Abu Dhabi	82880	4975593	AS	.ae	AED	Dirham              	971       	                    	                    	ar-AE,fa,en,hi,ur	290557	SA,OM               	\\r        	\N	\N
239	GB	GBR	826	UK	United Kingdom	London	244820	62348447	EU	.uk	GBP	Pound               	44        	@# #@@|@## #@@|@@# #	^(([A-Z]d{2}[A-Z]{2}	en-GB,cy-GB,gd	2635167	IE                  	\\r        	\N	\N
240	US	USA	840	US	United States	Washington	9629091	310232863	NA	.us	USD	Dollar              	1         	#####-####          	^(d{9})$            	en-US,es-US,haw,fr	6252001	CA,MX,CU            	\\r        	\N	\N
241	UM	UMI	581		United States Minor Outlying Islands		0	0	OC	.um	USD	Dollar              	1         	                    	                    	en-UM	5854968	                    	\\r        	\N	\N
242	UY	URY	858	UY	Uruguay	Montevideo	176220	3477000	SA	.uy	UYU	Peso                	598       	#####               	^(d{5})$            	es-UY	3439705	BR,AR               	\\r        	\N	\N
243	UZ	UZB	860	UZ	Uzbekistan	Tashkent	447400	27865738	AS	.uz	UZS	Som                 	998       	######              	^(d{6})$            	uz,ru,tg	1512440	TM,AF,KG,TJ,KZ      	\\r        	\N	\N
244	VU	VUT	548	NH	Vanuatu	Port Vila	12200	221552	OC	.vu	VUV	Vatu                	678       	                    	                    	bi,en-VU,fr-VU	2134431	                    	\\r        	\N	\N
245	VA	VAT	336	VT	Vatican	Vatican City	0.440000000000000002	921	EU	.va	EUR	Euro                	379       	                    	                    	la,it,fr	3164670	IT                  	\\r        	\N	\N
246	VE	VEN	862	VE	Venezuela	Caracas	912050	27223228	SA	.ve	VEF	Bolivar             	58        	####                	^(d{4})$            	es-VE	3625428	GY,BR,CO            	\\r        	\N	\N
247	VN	VNM	704	VM	Vietnam	Hanoi	329560	89571130	AS	.vn	VND	Dong                	84        	######              	^(d{6})$            	vi,en,fr,zh,km	1562822	CN,LA,KH            	\\r        	\N	\N
248	WF	WLF	876	WF	Wallis and Futuna	Mata Utu	274	16025	OC	.wf	XPF	Franc               	681       	#####               	^(986d{2})$         	wls,fud,fr-WF	4034749	                    	\\r        	\N	\N
249	EH	ESH	732	WI	Western Sahara	El-Aaiun	266000	273008	AF	.eh	MAD	Dirham              	212       	                    	                    	ar,mey	2461445	DZ,MR,MA            	\\r        	\N	\N
250	YE	YEM	887	YM	Yemen	Sanaa	527970	23495361	AS	.ye	YER	Rial                	967       	                    	                    	ar-YE	69543	SA,OM               	\\r        	\N	\N
251	ZM	ZMB	894	ZA	Zambia	Lusaka	752614	13460305	AF	.zm	ZMK	Kwacha              	260       	#####               	^(d{5})$            	en-ZM,bem,loz,lun,lue,ny,toi	895949	ZW,TZ,MZ,CD,NA,MW,AO	\\r        	\N	\N
252	ZW	ZWE	716	ZI	Zimbabwe	Harare	390580	11651858	AF	.zw	ZWL	Dollar              	263       	                    	                    	en-ZW,sn,nr,nd	878675	ZA,MZ,BW,ZM         	\\r        	\N	\N
\.


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('countries_id_seq', 253, false);


--
-- Data for Name: email_templates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY email_templates (id, created_at, updated_at, name, description, "from", reply_to, subject, email_variables, email_content, text_content, is_html, is_text, display_label) FROM stdin;
1	2016-05-30 11:13:01	2016-05-30 11:13:01	welcomemail	we will send this mail, when user register in this site and get activate.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	Welcome to ##SITE_NAME##	SITE_NAME, SITE_URL,USERNAME, SUPPORT_EMAIL,SITE_URL	Hi ##USERNAME##,\r\n\r\n  We wish to say a quick hello and thanks for registering at ##SITE_NAME##.\r\n  \r\n  If you did not request this account and feel this is in error, please contact us at ##SUPPORT_EMAIL##\r\n\r\nThanks,\r\n\r\n##SITE_NAME##\r\n##SITE_URL##	Hi ##USERNAME##,\r\n\r\n  We wish to say a quick hello and thanks for registering at ##SITE_NAME##.\r\n  \r\n  If you did not request this account and feel this is in error, please contact us at ##SUPPORT_EMAIL##\r\n\r\nThanks,\r\n\r\n##SITE_NAME##\r\n##SITE_URL##	0	1	Welcome Mail
2	2016-05-30 11:21:09	2016-05-30 11:21:09	activationrequest	we will send this mail,\r\nwhen user registering an account he/she will get an activation\r\nrequest.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	Please activate your ##SITE_NAME## account	SITE_NAME,SITE_URL,USERNAME,ACTIVATION_URL	Hi ##USERNAME##,\r\n\r\nYour account has been created. Please visit the following URL to activate your account.\r\n##ACTIVATION_URL##\r\n\r\nThanks,\r\n\r\n##SITE_NAME##\r\n##SITE_URL##	Hi ##USERNAME##,\r\n\r\nYour account has been created. Please visit the following URL to activate your account.\r\n##ACTIVATION_URL##\r\n\r\nThanks,\r\n\r\n##SITE_NAME##\r\n##SITE_URL##	0	1	Activation Request
3	2016-05-30 11:23:46	2016-05-30 11:23:46	changepassword	we will send this mail\r\nto user, when the user change password.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	Password changed	SITE_NAME,SITE_URL,PASSWORD,USERNAME	Hi ##USERNAME##,\r\n\r\nYour password has been changed\r\n\r\nYour new password:\r\n##PASSWORD##\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	Hi ##USERNAME##,\r\n\r\nYour password has been changed\r\n\r\nYour new password:\r\n##PASSWORD##\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	0	1	Change Password
4	2016-05-30 11:27:24	2016-05-30 11:27:24	forgotpassword	we will send this mail, when\r\nuser submit the forgot password form.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	Forgot password	USERNAME,PASSWORD,SITE_NAME,SITE_URL	Hi ##USERNAME##, \r\n\r\nWe have changed new password as per your requested.\r\n\r\nNew password: \r\n\r\n##PASSWORD##\r\n\r\nThanks, \r\n##SITE_NAME## \r\n##SITE_URL##	Hi ##USERNAME##, \r\n\r\nWe have changed new password as per your requested.\r\n\r\nNew password: \r\n\r\n##PASSWORD##\r\n\r\nThanks, \r\n##SITE_NAME## \r\n##SITE_URL##	0	1	Forgot Password
5	2016-05-30 11:29:19	2016-05-30 11:29:19	adminuseredit	we will send this mail\r\ninto user, when admin edit users profile.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	[##SITE_NAME##] Profile updated	SITE_NAME,EMAIL,USERNAME	Hi ##USERNAME##,\r\n\r\nAdmin updated your profile in ##SITE_NAME## account.\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	Hi ##USERNAME##,\r\n\r\nAdmin updated your profile in ##SITE_NAME## account.\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	0	1	Admin User Edit
6	2016-05-30 11:59:48	2016-05-30 11:59:48	adminpaidyourwithdrawalrequest	We will send mail to user once the admin paid.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	Amount paid	SITE_NAME,USERNAME,SITE_URL,WITHDRAWAL_URL	Hi ##USERNAME##,\r\n\r\n  We have paid your amount as you have requested from withdrawal requested.\r\n\r\nWithdrawal:\r\n\r\n##WITHDRAWAL_URL##\r\n\r\n  \r\nThanks,\r\n\r\n##SITE_NAME##\r\n##SITE_URL##'	Hi ##USERNAME##,\r\n\r\n  We have paid your amount as you have requested from withdrawal requested.\r\n\r\nWithdrawal:\r\n\r\n##WITHDRAWAL_URL##\r\n\r\n  \r\nThanks,\r\n\r\n##SITE_NAME##\r\n##SITE_URL##'	0	1	Paid Withdrawal Request
7	2016-05-30 12:24:36	2016-05-30 12:24:36	adminuseractive	we will send this mail to user, when a admin add a new user.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	Your ##SITE_NAME## account has been activated	SITE_NAME,USERNAME, SITE_URL	Dear ##USERNAME##,\r\n\r\nYour account has been activated.\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	Dear ##USERNAME##,\r\n\r\nYour account has been activated.\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	0	1	Admin User Active
8	2016-05-30 12:24:36	2016-05-30 12:24:36	adminuserdeactive	We will send this mail to user, when user deactive by administator.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	Your ##SITE_NAME## account has been deactivated	SITE_NAME,USERNAME, SITE_URL	Dear ##USERNAME##,\r\n\r\nYour ##SITE_NAME## account has been deactivated.\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	Dear ##USERNAME##,\r\n\r\nYour ##SITE_NAME## account has been deactivated.\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	0	1	Admin User Deactivate
9	2016-05-30 12:24:36	2016-05-30 12:24:36	adminuserdelete	We will send this mail to user, when user delete by administrator.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	Your ##SITE_NAME## account has been removed	SITE_NAME,USERNAME, SITE_URL	Dear ##USERNAME##,\r\n\r\nYour ##SITE_NAME## account has been removed.\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	Dear ##USERNAME##,\r\n\r\nYour ##SITE_NAME## account has been removed.\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	0	1	Admin User Delete
10	2016-05-30 12:24:36	2016-05-30 12:24:36	newuserjoin	we will send this mail to admin, when a new user registered in the site. For this you have to enable "admin mail after register" in the settings page.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	[##SITE_NAME##] New user joined	SITE_NAME,USERNAME, SITE_URL,USEREMAIL	Hi,\r\n\r\nA new user named "##USERNAME##" has joined in ##SITE_NAME##.\r\n\r\nUsername: ##USERNAME##\r\nEmail: ##USEREMAIL##\r\n\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	Hi,\r\n\r\nA new user named "##USERNAME##" has joined in ##SITE_NAME##.\r\n\r\nUsername: ##USERNAME##\r\nEmail: ##USEREMAIL##\r\n\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	0	1	New User Join
11	2016-05-30 12:24:36	2016-05-30 12:24:36	adminchangepassword	we will send this mail to user, when admin change users password.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	Password changed	SITE_NAME,PASSWORD,USERNAME, SITE_URL	Hi ##USERNAME##,\r\n\r\nAdmin reset your password for your  ##SITE_NAME## account.\r\n\r\nYour new password: ##PASSWORD##\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	Hi ##USERNAME##,\r\n\r\nAdmin reset your password for your  ##SITE_NAME## account.\r\n\r\nYour new password: ##PASSWORD##\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	0	1	Admin Change Password
12	2016-05-30 11:27:24	2016-05-30 11:27:24	failedsocialuser	we will send this mail, when user submit the forgot password form and the user users social network websites like twitter, facebook to register.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	Forgot password request failed	SITE_NAME, SITE_URL,USEREMAIL	Hi ##USERNAME##, \r\n\r\nYour forgot password request was failed because you have registered via ##OTHER_SITE## site.\r\n\r\nThanks, \r\n##SITE_NAME## \r\n##SITE_URL##	Hi ##USERNAME##, \r\n\r\nYour forgot password request was failed because you have registered via ##OTHER_SITE## site.\r\n\r\nThanks, \r\n##SITE_NAME## \r\n##SITE_URL##	0	1	Failed Social User
13	2016-05-30 12:24:36	2016-05-30 12:24:36	contactus	We will send this mail to admin, when user submit any contact form.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	[##SITE_NAME##] ##SUBJECT##	FIRST_NAME ,LAST_NAME,FROM_EMAIL,IP,TELEPHONE, MESSAGE, SUBJECT,SITE_NAME,SITE_URL	##MESSAGE##\r\n\r\n----------------------------------------------------\r\nFirst Name   : ##FIRST_NAME##  \r\nLast Name    : ##LAST_NAME## \r\nEmail        : ##FROM_EMAIL##\r\nTelephone    : ##TELEPHONE##\r\nIP           : ##IP##\r\nWhois        : http://whois.sc/##IP##\r\n\r\n----------------------------------------------------\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	##MESSAGE##\r\n\r\n----------------------------------------------------\r\nFirst Name   : ##FIRST_NAME##  \r\nLast Name    : ##LAST_NAME## \r\nEmail        : ##FROM_EMAIL##\r\nTelephone    : ##TELEPHONE##\r\nIP           : ##IP##\r\nWhois        : http://whois.sc/##IP##\r\n\r\n----------------------------------------------------\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	0	1	Contact Us
14	2016-05-30 12:24:36	2016-05-30 12:24:36	adminuseradd	we will send this mail to user, when a admin add a new user.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	Welcome to ##SITE_NAME##	SITE_NAME, USERNAME, PASSWORD, LOGINLABEL, USEDTOLOGIN, SITE_URL	Dear ##USERNAME##,\r\n\r\n##SITE_NAME## team added you as a user in ##SITE_NAME##.\r\n\r\nYour account details.\r\n##LOGINLABEL##:##USEDTOLOGIN##\r\nPassword:##PASSWORD##\r\n\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	Dear ##USERNAME##,\r\n\r\n##SITE_NAME## team added you as a user in ##SITE_NAME##.\r\n\r\nYour account details.\r\n##LOGINLABEL##:##USEDTOLOGIN##\r\nPassword:##PASSWORD##\r\n\r\n\r\nThanks,\r\n##SITE_NAME##\r\n##SITE_URL##	0	1	Admin User Add
15	2016-05-30 11:27:24	2016-05-30 11:27:24	failledforgotpassword	we will send this mail, when user submit the forgot password form.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	Failed Forgot Password	SITE_NAME, SITE_URL,USEREMAIL	Hi there,\r\n\r\nYou (or someone else) entered this email address when trying to change the password of an ##USEREMAIL## account.\r\n\r\nHowever, this email address is not in our registered users and therefore the attempted password request has failed. If you are our customer and were expecting this email, please try again using the email you gave when opening your account.\r\n\r\nIf you are not an ##SITE_NAME## customer, please ignore this email. If you did not request this action and feel this is an error, please contact us ##SUPPORT_EMAIL##.\r\n\r\nThanks, \r\n##SITE_NAME## \r\n##SITE_URL##	Hi there,\r\n\r\nYou (or someone else) entered this email address when trying to change the password of an ##USEREMAIL## account.\r\n\r\nHowever, this email address is not in our registered users and therefore the attempted password request has failed. If you are our customer and were expecting this email, please try again using the email you gave when opening your account.\r\n\r\nIf you are not an ##SITE_NAME## customer, please ignore this email. If you did not request this action and feel this is an error, please contact us ##SUPPORT_EMAIL##.\r\n\r\nThanks, \r\n##SITE_NAME## \r\n##SITE_URL##	0	1	Failed Forgot Password
17	2016-08-29 11:13:01	2016-08-29 11:13:01	followinguser	we will send this mail, when user follow other user.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	##FOLLOWERUSER## Following You	SITE_NAME, SITE_URL,USERNAME, SUPPORT_EMAIL,SITE_URL,FOLLOWERUSER,	Hi ##USERNAME##,\n\n##FOLLOWERUSER## has following you in this ##SITE_NAME##\n\nThanks,\n##SITE_NAME##\n##SITE_URL##	Hi ##USERNAME##,\n\n##FOLLOWERUSER## has following you in this ##SITE_NAME##\n\nThanks,\n##SITE_NAME##\n##SITE_URL##	0	1	Following user Mail
18	2016-08-29 11:13:01	2016-08-29 11:13:01	mentioneduser	we will send this mail, when user mentioned other user.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	##MENTIONUSER## has mentioned you in post	SITE_NAME, SITE_URL,USERNAME, SUPPORT_EMAIL,SITE_URL,MENTIONUSER,	Hi ##USERNAME##,\n\n##MENTIONUSER## has mentioned you in ##POST##\n\nThanks,\n##SITE_NAME##\n##SITE_URL##	Hi ##USERNAME##,\n\n##MENTIONUSER## has mentioned you in ##POST##\n\nThanks,\n##SITE_NAME##\n##SITE_URL##	0	1	Mentioned user Mail
19	2016-08-29 11:13:01	2016-08-29 11:13:01	messagereceived	we will send this mail, when user received message.	##FROM_EMAIL##	##REPLY_TO_EMAIL##	You have one new message	SITE_NAME, SITE_URL,USERNAME, SUPPORT_EMAIL,SITE_URL,OTHER_USER,MESSAGE_URL	Hi ##USERNAME##,\n\n##OTHER_USER## has sent message to you. Please click below link to view your message\n\n##MESSAGE_URL##\n\nThanks,\n##SITE_NAME##\n##SITE_URL##	Hi ##USERNAME##,\n\n##OTHER_USER## has sent message to you. Please click below link to view your message\n\n##MESSAGE_URL##\n\nThanks,\n##SITE_NAME##\n##SITE_URL##	0	1	Message received Mail
20	2016-09-23 16:57:34	2016-09-23 16:57:34	photopost	New post added	##FROM_EMAIL##	##REPLY_TO_EMAIL##	New post added by ##POSTUSER##	SITE_NAME, SITE_URL,USERNAME, SUPPORT_EMAIL,SITE_URL,POSTUSER,	Hi ##USERNAME##,\n\nNew post added by ##POSTUSER##\n\nThanks,\n##POSTUSER##\n##SITE_URL##	Hi ##USERNAME##,\n\nNew post added by ##POSTUSER##\n\nThanks,\n##POSTUSER##\n##SITE_URL##	0	1	Post user mail
\.


--
-- Name: email_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('email_templates_id_seq', 20, true);


--
-- Data for Name: flags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY flags (id, created_at, updated_at, flagged_user_id, user_id, photo_id, ip_id, flag_category_id, type) FROM stdin;
\.


--
-- Name: flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('flags_id_seq', 1, false);


--
-- Data for Name: ips; Type: TABLE DATA; Schema: public; Owner: -
--

COPY ips (id, created_at, updated_at, ip, host, city_id, state_id, country_id, timezone_id, latitude, longitude) FROM stdin;
2	2016-09-12 16:22:43	2016-09-12 16:22:43	127.0.0.1	localhost.localdomain	\N	\N	\N	\N	\N	\N
\.


--
-- Name: ips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('ips_id_seq', 2, true);


--
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY languages (id, created_at, updated_at, name, iso2, iso3, is_active) FROM stdin;
1	2009-07-01 13:52:24	2009-07-01 13:52:24	Abkhazian	ab	abk	f
2	2009-07-01 13:52:24	2013-07-22 08:17:56	Afar	aa	aar	t
3	2009-07-01 13:52:24	2009-07-01 13:52:24	Afrikaans	af	afr	t
4	2009-07-01 13:52:24	2009-07-01 13:52:24	Akan	ak	aka	t
5	2009-07-01 13:52:25	2009-07-01 13:52:25	Albanian	sq	sqi	t
6	2009-07-01 13:52:24	2009-07-01 13:52:24	Amharic	am	amh	t
7	2009-07-01 13:52:24	2009-07-01 13:52:24	Arabic	ar	ara	t
8	2009-07-01 13:52:24	2009-07-01 13:52:24	Aragonese	an	arg	t
9	2009-07-01 13:52:25	2009-07-01 13:52:25	Armenian	hy	hye	t
10	2009-07-01 13:52:24	2009-07-01 13:52:24	Assamese	as	asm	t
11	2009-07-01 13:52:24	2009-07-01 13:52:24	Avaric	av	ava	t
12	2009-07-01 13:52:24	2009-07-01 13:52:24	Avestan	ae	ave	t
13	2009-07-01 13:52:24	2009-07-01 13:52:24	Aymara	ay	aym	t
14	2009-07-01 13:52:24	2009-07-01 13:52:24	Azerbaijani	az	aze	t
15	2009-07-01 13:52:24	2009-07-01 13:52:24	Bambara	bm	bam	t
16	2009-07-01 13:52:24	2009-07-01 13:52:24	Bashkir	ba	bak	t
17	2009-07-01 13:52:25	2009-07-01 13:52:25	Basque	eu	eus	t
18	2009-07-01 13:52:24	2009-07-01 13:52:24	Belarusian	be	bel	t
19	2009-07-01 13:52:24	2009-07-01 13:52:24	Bengali	bn	ben	t
20	2009-07-01 13:52:24	2009-07-01 13:52:24	Bihari	bh	bih	t
21	2009-07-01 13:52:24	2009-07-01 13:52:24	Bislama	bi	bis	t
22	2009-07-01 13:52:24	2009-07-01 13:52:24	Bosnian	bs	bos	t
23	2009-07-01 13:52:24	2009-07-01 13:52:24	Breton	br	bre	t
24	2009-07-01 13:52:24	2009-07-01 13:52:24	Bulgarian	bg	bul	t
25	2009-07-01 13:52:25	2009-07-01 13:52:25	Burmese	my	mya	t
26	2009-07-01 13:52:24	2011-10-22 08:13:07	Catalan	ca	cat	t
27	2009-07-01 13:52:25	2009-07-01 13:52:25	Chamorro	ch	cha	t
28	2009-07-01 13:52:25	2009-07-01 13:52:25	Chechen	ce	che	t
29	2009-07-01 13:52:25	2009-07-01 13:52:25	Chichewa	ny	nya	t
30	2009-07-01 13:52:25	2009-07-01 13:52:25	Chinese	zh	zho	t
31	2009-07-01 13:52:25	2009-07-01 13:52:25	Church Slavic	cu	chu	t
32	2009-07-01 13:52:25	2009-07-01 13:52:25	Chuvash	cv	chv	t
33	2009-07-01 13:52:25	2009-07-01 13:52:25	Cornish	kw	cor	t
34	2009-07-01 13:52:25	2009-07-01 13:52:25	Corsican	co	cos	t
35	2009-07-01 13:52:25	2009-07-01 13:52:25	Cree	cr	cre	t
36	2009-07-01 13:52:25	2009-07-01 13:52:25	Croatian	hr	hrv	t
37	2009-07-01 13:52:25	2009-07-01 13:52:25	Czech	cs	ces	t
38	2009-07-01 13:52:25	2011-05-23 12:29:53	Danish	da	dan	t
39	2009-07-01 13:52:25	2009-07-01 13:52:25	Divehi	dv	div	t
40	2009-07-01 13:52:25	2009-07-01 13:52:25	Dutch	nl	nld	t
41	2009-07-01 13:52:25	2009-07-01 13:52:25	Dzongkha	dz	dzo	t
42	2009-07-01 13:52:25	2009-07-01 13:52:25	English	en	eng	t
43	2009-07-01 13:52:25	2009-07-01 13:52:25	Esperanto	eo	epo	t
44	2009-07-01 13:52:25	2009-07-01 13:52:25	Estonian	et	est	t
45	2009-07-01 13:52:25	2009-07-01 13:52:25	Ewe	ee	ewe	t
46	2009-07-01 13:52:25	2009-07-01 13:52:25	Faroese	fo	fao	t
47	2009-07-01 13:52:25	2009-07-01 13:52:25	Fijian	fj	fij	t
48	2009-07-01 13:52:25	2009-07-01 13:52:25	Finnish	fi	fin	t
49	2009-07-01 13:52:25	2009-07-01 13:52:25	French	fr	fra	t
50	2009-07-01 13:52:25	2009-07-01 13:52:25	Fulah	ff	ful	t
51	2009-07-01 13:52:25	2009-07-01 13:52:25	Galician	gl	glg	t
52	2009-07-01 13:52:25	2009-07-01 13:52:25	Ganda	lg	lug	t
53	2009-07-01 13:52:25	2009-07-01 13:52:25	Georgian	ka	kat	t
54	2009-07-01 13:52:25	2009-07-01 13:52:25	German	de	deu	t
55	2009-07-01 13:52:25	2009-07-01 13:52:25	Greek	el	ell	t
56	2009-07-01 13:52:25	2009-07-01 13:52:25	GuaranÃƒÆ’Ã	gn	grn	t
57	2009-07-01 13:52:25	2009-07-01 13:52:25	Gujarati	gu	guj	t
58	2009-07-01 13:52:25	2009-07-01 13:52:25	Haitian	ht	hat	t
59	2009-07-01 13:52:25	2009-07-01 13:52:25	Hausa	ha	hau	t
60	2009-07-01 13:52:25	2009-07-01 13:52:25	Hebrew	he	heb	t
61	2009-07-01 13:52:25	2009-07-01 13:52:25	Herero	hz	her	t
62	2009-07-01 13:52:25	2009-07-01 13:52:25	Hindi	hi	hin	t
63	2009-07-01 13:52:25	2009-07-01 13:52:25	Hiri Motu	ho	hmo	t
64	2009-07-01 13:52:25	2009-07-01 13:52:25	Hungarian	hu	hun	t
65	2009-07-01 13:52:25	2009-07-01 13:52:25	Icelandic	is	isl	t
\.


--
-- Name: languages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('languages_id_seq', 6, false);


--
-- Data for Name: message_contents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY message_contents (id, created_at, updated_at, message) FROM stdin;
\.


--
-- Name: message_contents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('message_contents_id_seq', 1, false);


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY messages (id, created_at, updated_at, user_id, other_user_id, is_sender, is_read, parent_message_id, message, message_content_id) FROM stdin;
\.


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('messages_id_seq', 1, false);


--
-- Name: money_transfer_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('money_transfer_account_id_seq', 1, false);


--
-- Data for Name: oauth_access_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY oauth_access_tokens (access_token, client_id, user_id, expires, scope) FROM stdin;
4e0b4084389755d5eb80c9150f11daed5eebfd55	2212711849319225	\N	2016-09-12 17:22:38	\N
5ff40d5767257f1f9815b982ea6c41ae5f130814	2212711849319225	admin	2016-09-12 17:22:43	\N
\.


--
-- Data for Name: oauth_authorization_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY oauth_authorization_codes (authorization_code, client_id, user_id, redirect_uri, expires, scope) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY oauth_clients (id, created_at, updated_at, client_id, client_secret, redirect_uri, grant_types, scope, user_id, client_name, client_url, logo_url, tos_url, policy_url) FROM stdin;
1	2016-05-13 15:28:23	2016-05-13 15:28:23	2212711849319225	14uumnygq6xyorsry8l382o3myr852hb	\N	client_credentials password refresh_token authorization_code	\N	1		\N	\N	\N	\N
\.


--
-- Name: oauth_clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('oauth_clients_id_seq', 1, true);


--
-- Data for Name: oauth_jwt; Type: TABLE DATA; Schema: public; Owner: -
--

COPY oauth_jwt (client_id, subject, public_key) FROM stdin;
\.


--
-- Data for Name: oauth_refresh_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY oauth_refresh_tokens (refresh_token, client_id, user_id, expires, scope) FROM stdin;
4cdd1680380e37c7d52534622ee1820b67c8b654	2212711849319225	admin	2016-09-26 16:22:43	\N
\.


--
-- Data for Name: oauth_scopes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY oauth_scopes (scope, is_default) FROM stdin;
canUpdateUser	f
canUpdateMessage	f
canListUserTransactions	f
canUserCreateUserCashWithdrawals	f
canUserListUserCashWithdrawals	f
canUserViewUserCashWithdrawals	f
canUserDeleteUserCashWithdrawals	f
canUserCreateMoneyTransferAccount	f
canUserUpdateMoneyTransferAccount	f
canUserViewMoneyTransferAccount	f
canUserListMoneyTransferAccount	f
canUserDeleteMoneyTransferAccount	f
canCreatePhoto	f
canListActivity	f
canCreateMessage	f
canDeleteUser	f
canListMessage	f
canCreatePhotoLike	f
canDeletePhotoLike	f
canDeletePhoto	f
canUpdatePhoto	f
canCreateUserFollow	f
canDeleteUserFollow	f
canViewUserNotificationSetting	f
canUpdateUserNotificationSetting	f
canDeleteActivity	f
canDeletePhotoComment	f
canUpdateActivity	f
canUpdatePhotoComment	f
canViewMessage	f
canCreateFlag	f
canDeleteFlag	f
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY pages (id, created_at, updated_at, title, slug, content, meta_keywords, meta_description, is_active) FROM stdin;
1	2016-05-30 12:17:27	2016-05-30 12:17:27	Privacy Policy	privacy-policy	For each visitor to our Web page our Web server automatically recognizes no information regarding the domain or e-mail address.\r\n\r\nWe collect the e-mail addresses of those who post messages to our bulletin board the e-mail addresses of those who communicate with us via e-mail the e-mail addresses of those who make postings to our chat areas user-specific information on what pages consumers access or visit information volunteered by the consumer such as survey information and/or site registrations name and address telephone number.\r\n\r\nThe information we collect is disclosed when legally required to do so at the request of governmental authorities conducting an investigation to verify or enforce compliance with the policies governing our Website and applicable laws or to protect against misuse or unauthorized use of our Website to a successor entity in connection with a corporate merger consolidation sale of assets or other corporate change respecting the Website.\r\n\r\nWith respect to cookies. We use cookies to record session information such as items that consumers add to their shopping cart.\r\n\r\nIf you do not want to receive e-mail from us in the future please let us know by sending us e-mail at the above address.\r\n\r\nPersons who supply us with their telephone numbers on-line will only receive telephone contact from us with information regarding orders they have placed on-line. Please provide us with your name and phone number. We will be sure your name is removed from the list we share with other organizations.\r\n\r\nWith respect to Ad Servers. We do not partner with or have special relationships with any ad server companies.\r\n\r\nFrom time to time we may use customer information for new unanticipated uses not previously disclosed in our privacy notice. If our information practices change at some time in the future we will post the policy changes to our Web site to notify you of these changes and we will use for these new purposes only data collected from the time of the policy change forward. If you are concerned about how your information is used you should check back at our Web site periodically.\r\n\r\nUpon request we provide site visitors with access to transaction information (e.g. dates on which customers made purchases amounts and types of purchases) that we maintain about them.\r\n\r\nUpon request we offer visitors the ability to have inaccuracies corrected in contact information transaction information.\r\n\r\nWith respect to security. When we transfer and receive certain types of sensitive information such as financial or health information we redirect visitors to a secure server and will notify visitors through a pop-up screen on our site.\r\n\r\nIf you feel that this site is not following its stated information policy you may contact us at the above addresses or phone number.	privacy	privacy,policy	t
2	2016-05-30 12:17:27	2016-05-30 12:17:27	Terms and Conditions	terms-and-conditions	<h1>Web Site Terms and Conditions of Use </h1>\r\n\r\n1. Terms\r\nBy accessing this web site you are agreeing to be bound by these web site Terms and Conditions of Use all applicable laws and regulations and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms you are prohibited from using or accessing this site. The materials contained in this web site are protected by applicable copyright and trade mark law.\r\n\r\n2. Use License\r\n\r\n    Permission is granted to temporarily download one copy of the materials (information or software) on crowdfunding web site for personal non-commercial transitory viewing only. This is the grant of a license not a transfer of title and under this license you may not:\r\n        modify or copy the materials;\r\n        use the materials for any commercial purpose or for any public display (commercial or non-commercial);\r\n        attempt to decompile or reverse engineer any software contained on crowdfunding web site;\r\n        remove any copyright or other proprietary notations from the materials; or\r\n        transfer the materials to another person or mirror the materials on any other server.\r\n    This license shall automatically terminate if you violate any of these restrictions and may be terminated by crowdfunding at any time. Upon terminating your viewing of these materials or upon the termination of this license you must destroy any downloaded materials in your possession whether in electronic or printed format.\r\n\r\n3. Disclaimer\r\nThe materials on crowdfunding web site are provided as is. crowdfunding makes no warranties expressed or implied and hereby disclaims and negates all other warranties including without limitation implied warranties or conditions of merchantability fitness for a particular purpose or non-infringement of intellectual property or other violation of rights. Further crowdfunding does not warrant or make any representations concerning the accuracy likely results or reliability of the use of the materials on its Internet web site or otherwise relating to such materials or on any sites linked to this site.\r\n4. Limitations\r\nIn no event shall crowdfunding or its suppliers be liable for any damages (including without limitation damages for loss of data or profit or due to business interruption) arising out of the use or inability to use the materials on crowdfunding Internet site even if crowdfunding or a crowdfunding authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties or limitations of liability for consequential or incidental damages these limitations may not apply to you.\r\n5. Revisions and Errata\r\nThe materials appearing on crowdfunding web site could include technical typographical or photographic errors. crowdfunding does not warrant that any of the materials on its web site are accurate complete or current. crowdfunding may make changes to the materials contained on its web site at any time without notice. crowdfunding does not however make any commitment to update the materials.\r\n6. Links\r\ncrowdfunding has not reviewed all of the sites linked to its Internet web site and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by crowdfunding of the site. Use of any such linked web site is at the users own risk.\r\n7. Site Terms of Use Modifications\r\ncrowdfunding may revise these terms of use for its web site at any time without notice. By using this web site you are agreeing to be bound by the then current version of these Terms and Conditions of Use.	terms	terms	t
3	2016-05-30 12:24:36	2016-05-30 12:24:36	Acceptable Use Policy	aup	You are independently responsible for complying with all applicable laws in all of your actions related to your use of PayPal’s services, regardless of the purpose of the use. In addition, you must adhere to the terms of this Acceptable Use Policy.\r\n\r\n<h3> Prohibited Activities</h3>\r\n\r\nYou may not use the PayPal service for activities that:\r\n\r\nviolate any law, statute, ordinance or regulation\r\nrelate to sales of (a) narcotics, steroids, certain controlled substances or other products that present a risk to consumer safety, (b) drug paraphernalia, (c) items that encourage, promote, facilitate or instruct others to engage in illegal activity, (d) items that promote hate, violence, racial intolerance, or the financial exploitation of a crime, (e) items that are considered obscene, (f) items that infringe or violate any copyright, trademark, right of publicity or privacy or any other proprietary right under the laws of any jurisdiction, (g) certain sexually oriented materials or services, (h) ammunition, firearms, or certain firearm parts or accessories, or (i) certain weapons or knives regulated under applicable law\r\nrelate to transactions that (a) show the personal information of third parties in violation of applicable law, (b) support pyramid or ponzi schemes, matrix programs, other “get rich quick” schemes or certain multi-level marketing programs, (c) are associated with purchases of real property, annuities or lottery contracts, lay-away systems, off-shore banking or transactions to finance or refinance debts funded by a credit card, (d) are for the sale of certain items before the seller has control or possession of the item, (e) are by payment processors to collect payments on behalf of merchants, (f) are associated with the following Money Service Business Activities: the sale of traveler’s cheques or money orders, currency exchanges or cheque cashing, or (g) provide certain credit repair or debt settlement services\r\ninvolve the sales of products or services identified by government agencies to have a high likelihood of being fraudulent\r\nviolate applicable laws or industry regulations regarding the sale of (a) tobacco products, or (b) prescription drugs and devices\r\ninvolve gambling, gaming and/or any other activity with an entry fee and a prize, including, but not limited to casino games, sports betting, horse or greyhound racing, lottery tickets, other ventures that facilitate gambling, games of skill (whether or not it is legally defined as a lottery) and sweepstakes unless the operator has obtained prior approval from PayPal and the operator and customers are located exclusively in jurisdictions where such activities are permitted by law.\r\n	policy	policy	t
\.


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('pages_id_seq', 3, true);


--
-- Data for Name: photo_comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY photo_comments (id, created_at, updated_at, photo_id, user_id, ip_id, comment) FROM stdin;
\.


--
-- Name: photo_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('photo_comments_id_seq', 1, false);


--
-- Name: photo_comments_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('photo_comments_id_seq1', 1, false);


--
-- Name: photo_flag_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('photo_flag_categories_id_seq', 1, false);


--
-- Name: photo_flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('photo_flags_id_seq', 1, false);


--
-- Data for Name: photo_likes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY photo_likes (id, created_at, updated_at, photo_id, user_id, ip_id) FROM stdin;
\.


--
-- Name: photo_likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('photo_likes_id_seq', 1, false);


--
-- Name: photo_likes_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('photo_likes_id_seq1', 1, false);


--
-- Data for Name: photo_tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY photo_tags (id, created_at, updated_at, name, slug, photo_count) FROM stdin;
\.


--
-- Name: photo_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('photo_tags_id_seq', 1, false);


--
-- Data for Name: photo_views; Type: TABLE DATA; Schema: public; Owner: -
--

COPY photo_views (id, created_at, updated_at, photo_id, user_id, ip_id) FROM stdin;
\.


--
-- Name: photo_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('photo_views_id_seq', 1, false);


--
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY photos (id, created_at, updated_at, user_id, description, photo_comment_count, photo_like_count, photo_flag_count, photo_view_count, is_video, is_attachment_to_view, is_video_converting_is_processing) FROM stdin;
\.


--
-- Name: photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('photos_id_seq', 1, false);


--
-- Name: photos_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('photos_id_seq1', 1, false);


--
-- Data for Name: photos_photo_tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY photos_photo_tags (id, created_at, updated_at, photo_id, photo_tag_id, is_indirect_tag) FROM stdin;
\.


--
-- Name: photos_photo_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('photos_photo_tags_id_seq', 1, false);


--
-- Name: photos_photo_tags_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('photos_photo_tags_id_seq1', 1, false);


--
-- Data for Name: provider_users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY provider_users (id, created_at, updated_at, user_id, provider_id, access_token, access_token_secret, is_connected, profile_picture_url, foreign_id) FROM stdin;
\.


--
-- Name: provider_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('provider_users_id_seq', 1, false);


--
-- Data for Name: providers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY providers (id, created_at, updated_at, name, secret_key, api_key, icon_class, button_class, is_active, display_order, slug) FROM stdin;
2	2016-05-28 14:31:37	2016-05-28 14:31:37	Twitter	\N	\N	fa-twitter	btn-twitter	t	2	twitter
3	2016-05-28 14:32:26	2016-05-28 14:32:35	Google	\N	\N	fa-google-plus	btn-google	t	3	google
1	2016-05-28 14:30:49	2016-06-14 09:55:50	Facebook			fa-facebook	btn-facebook	f	1	facebook
\.


--
-- Name: providers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('providers_id_seq', 3, true);


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY roles (id, created_at, updated_at, name, is_active) FROM stdin;
1	2016-06-13 16:02:55	2016-06-13 16:02:55	Admin	t
2	2016-06-13 16:02:55	2016-05-13 15:28:23	User	t
\.


--
-- Data for Name: setting_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY setting_categories (id, created_at, updated_at, name, description) FROM stdin;
1	2016-05-30 12:17:27	2016-05-30 12:17:27	System	Manage site name, contact email, from email and reply to email.
2	2016-05-30 12:17:27	2016-05-30 12:17:27	SEO	Manage content, meta data and other information relevant to browsers or search engines.
3	2016-05-30 12:25:53	2016-05-30 12:25:53	Account	Manage different type of login option such as Facebook, Twitter and OpenID.
\.


--
-- Name: setting_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('setting_categories_id_seq', 27, true);


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY settings (id, setting_category_id, name, value, description, type, label, "order", options, created_at, updated_at) FROM stdin;
5	1	SITE_NAME	Base	This name will be used in all pages and emails.	text	Site name	1	\N	2016-05-30 12:25:53	2016-05-30 12:25:53
1	1	SITE_FROM_EMAIL	productdemo.admin@gmail.com	You can change this email address so that 'From' email will be changed in all email communication.	text	From Email Address	2	\N	2016-05-30 12:25:53	2016-05-30 12:24:36
2	1	SITE_CONTACT_EMAIL	productdemo.admin@gmail.com	Contact email	test	Contact Email	3	\N	2016-05-30 12:25:53	2016-05-30 12:25:53
3	1	SITE_REPLY_TO_EMAIL	productdemo.admin@gmail.com	You can change this email address so that 'Reply To' email will be changed in all email communication.	text	Reply To Email Address	4	\N	2016-05-30 12:17:27	2016-05-30 12:25:53
4	1	SUPPORT_EMAIL	productdemo.admin@gmail.com	Support email	text	Support Email Address	5	\N	2016-05-30 12:25:53	2016-05-30 12:25:53
7	2	META_KEYWORDS	agriya, food, online food order	These are the keywords used for improving search engine results of your site. (Comma separated texts for multiple keywords.)	text	Keywords	1	\N	2016-05-30 12:17:27	2016-05-30 12:24:36
8	2	META_DESCRIPTION	Ofos helps you develop different clone in a foodpanda	These are the short descriptions for your site which will be used by the search engines on the search result pages to display preview snippets for a given page.	textarea	Description	2		2016-05-30 12:24:36	2016-05-30 12:17:27
10	2	SITE_ROBOTS	Content for robots.txt; (search engine) robots specific instructions. Refer, <a href="http://www.robotstxt.org/">http://www.robotstxt.org/</a> for syntax and usage.	\N	textarea	robots.txt	4		2016-05-30 12:24:36	2016-05-30 12:17:27
28	3	USER_IS_WELCOME_MAIL_AFTER_REGISTER	0	On enabling this feature, users will receive a welcome mail after registration.	checkbox	Enable Sending Welcome Mail After Registration	6	\N	2016-05-30 12:17:27	2016-05-30 12:17:27
29	3	USER_IS_ADMIN_MAIL_AFTER_REGISTER	0	On enabling this feature, notification mail will be sent to administrator on each registration.	checkbox	Enable Notify Administrator on Each Registration	7	\N	2016-05-30 12:17:27	2016-05-30 12:17:27
11	1	SITE_LANGUAGE	en	The selected language will be used as default language all over the site.	select	Site language 	7	\N	2016-05-30 12:25:53	2016-05-30 12:25:53
15	3	USER_USING_TO_LOGIN	username	You can select the option from the drop-downs to login into the site	select	Login Handle	1	username, email	2016-05-30 12:17:27	2016-05-30 12:17:27
21	3	USER_IS_AUTO_LOGIN_AFTER_REGISTER	0	On enabling this feature, users will be automatically logged-in after registration. (Only when "Email Verification" & "Admin Approval" is disabled)	checkbox	Enable Auto Login After Registration	4	\N	2016-05-30 12:17:27	2016-05-30 12:17:27
27	3	USER_IS_LOGOUT_AFTER_CHANGE_PASSWORD	0	By enabling this feature, When user changes the password, he will automatically log-out.	checkbox	Enable User to Logout after Password Change	5	\N	2016-05-30 12:17:27	2016-05-30 12:17:27
20	3	USER_IS_EMAIL_VERIFICATION_FOR_REGISTER	0	On enabling this feature, the users are required to verify their email address which will be provided by them during registration. (Users cannot login until the email address is verified)	checkbox	Enable Email Verification After Registration	2	\N	2016-05-30 12:17:27	2016-05-30 12:17:27
19	3	USER_IS_ADMIN_ACTIVATE_AFTER_REGISTER	0	On enabling this feature, the user will not be able to login until the Admin (that will be you) approves their registration.	checkbox	Enable Administrator Approval After Registration	3	\N	2016-05-30 12:17:27	2016-05-30 12:17:27
9	2	SITE_TRACKING_SCRIPT	<script type="text/javascript"> var _gaq = _gaq || []; _gaq.push(['_setAccount', 'UA-18572079-3']); _gaq.push(['_setDomainName', '.dev.agriya.com']); _gaq.push(['_setAllowAnchor', true]); _gaq.push(['_trackPageview']); _gaq.push(function() { href = window.location.search; href.replace(/(utm_source|utm_medium|utm_campaign|utm_term|utm_content)+=[^\\&]*/g, '').replace(/\\&+/g, '&').replace(/\\?\\&/g, '?').replace(/(\\?|\\&)$/g, ''); if (history.replaceState) history.replaceState(null, '', location.pathname + href + location.hash);}); (function() { var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); })(); </script>	This is the site tracker script used for tracking and analyzing the data on how the people are getting into your website. e.g., Google Analytics. <a href="http://www.google.com/analytics" target="_blank">http://www.google.com/analytics</a>	textarea	Site Tracker Code	3	\N	2016-05-30 12:17:27	2016-05-30 12:24:36
\.


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('settings_id_seq', 31, true);


--
-- Data for Name: states; Type: TABLE DATA; Schema: public; Owner: -
--

COPY states (id, created_at, updated_at, country_id, name, state_code, slug, is_active) FROM stdin;
\.


--
-- Name: states_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('states_id_seq', 1, true);


--
-- Data for Name: user_follows; Type: TABLE DATA; Schema: public; Owner: -
--

COPY user_follows (id, created_at, updated_at, user_id, other_user_id) FROM stdin;
\.


--
-- Name: user_follows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('user_follows_id_seq', 1, false);


--
-- Name: user_follows_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('user_follows_id_seq1', 1, false);


--
-- Data for Name: user_logins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY user_logins (id, created_at, updated_at, user_id, ip_id, user_agent) FROM stdin;
1	2016-09-12 16:22:43	2016-09-12 16:22:43	1	2	Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.92 Safari/537.36
\.


--
-- Name: user_logins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('user_logins_id_seq', 1, true);


--
-- Data for Name: user_notification_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY user_notification_settings (id, created_at, updated_at, user_id, is_enable_email_when_someone_follow_me, is_enable_email_when_someone_mentioned_me, is_enable_email_when_someone_message_me, is_enable_subscribe_me_for_newsletter, is_enable_subscribe_me_for_weeky_replay, is_enable_email_when_follow_post) FROM stdin;
1	2018-05-19 12:34:43.350412	2018-05-19 12:34:43.350412	1	t	t	t	t	t	t
\.


--
-- Name: user_notification_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('user_notification_settings_id_seq', 1, true);


--
-- Name: user_notification_settings_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('user_notification_settings_id_seq1', 1, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY users (id, created_at, updated_at, role_id, last_login_ip_id, email, password, is_email_confirmed, is_agree_terms_conditions, username, last_logged_in_time, provider_id, first_name, last_name, gender_id, dob, about_me, address, address1, city_id, state_id, country_id, zip_code, latitude, longitude, is_active, twitter_username, facebook_username, instagram_username, linkedin_username, medium_username, youtube_username, etsy_username, educations, brands, recognitions, website, middle_name, unread_activities_count, unread_messages_count, user_following_count, user_follower_count, is_show_profile_picture_in_search_engine, is_show_pictures_in_search_engine, user_login_count, photo_count, mobile, user_notification_setting_id, full_address, flag_count) FROM stdin;
1	2016-06-14 18:20:16	2016-09-12 16:22:43	1	2	admin@agriya.in	$2y$12$7Bezs1GQsctRnC80lGMC7e4Q.g2opvnIyURlXhFqQ7urzI1voVp5y	t	f	admin	2016-09-12 04:22:43	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	0	0	0	t	t	1	0	\N	0		0
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('users_id_seq', 2, true);


--
-- Name: activities_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY activities
    ADD CONSTRAINT activities_id PRIMARY KEY (id);


--
-- Name: attachments_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY attachments
    ADD CONSTRAINT attachments_id PRIMARY KEY (id);


--
-- Name: banned_ips_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY banned_ips
    ADD CONSTRAINT banned_ips_id PRIMARY KEY (id);


--
-- Name: cities_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY cities
    ADD CONSTRAINT cities_id PRIMARY KEY (id);


--
-- Name: contacts_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY contacts
    ADD CONSTRAINT contacts_id PRIMARY KEY (id);


--
-- Name: countries_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY countries
    ADD CONSTRAINT countries_id PRIMARY KEY (id);


--
-- Name: email_templates_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY email_templates
    ADD CONSTRAINT email_templates_id PRIMARY KEY (id);


--
-- Name: ips_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY ips
    ADD CONSTRAINT ips_id PRIMARY KEY (id);


--
-- Name: languages_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY languages
    ADD CONSTRAINT languages_id PRIMARY KEY (id);


--
-- Name: messages_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT messages_id PRIMARY KEY (id);


--
-- Name: oauth_clients_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY oauth_clients
    ADD CONSTRAINT oauth_clients_id PRIMARY KEY (id);


--
-- Name: pages_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY pages
    ADD CONSTRAINT pages_id PRIMARY KEY (id);


--
-- Name: photo_comments_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photo_comments
    ADD CONSTRAINT photo_comments_id PRIMARY KEY (id);


--
-- Name: photo_tags_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photo_tags
    ADD CONSTRAINT photo_tags_id PRIMARY KEY (id);


--
-- Name: photo_views_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photo_views
    ADD CONSTRAINT photo_views_id PRIMARY KEY (id);


--
-- Name: photos_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photos
    ADD CONSTRAINT photos_id PRIMARY KEY (id);


--
-- Name: photos_photo_tags_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photos_photo_tags
    ADD CONSTRAINT photos_photo_tags_id PRIMARY KEY (id);


--
-- Name: provider_users_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY provider_users
    ADD CONSTRAINT provider_users_id PRIMARY KEY (id);


--
-- Name: providers_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY providers
    ADD CONSTRAINT providers_id PRIMARY KEY (id);


--
-- Name: roles_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_id PRIMARY KEY (id);


--
-- Name: setting_categories_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY setting_categories
    ADD CONSTRAINT setting_categories_id PRIMARY KEY (id);


--
-- Name: settings_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY settings
    ADD CONSTRAINT settings_id PRIMARY KEY (id);


--
-- Name: states_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY states
    ADD CONSTRAINT states_id PRIMARY KEY (id);


--
-- Name: user_follows_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_follows
    ADD CONSTRAINT user_follows_id PRIMARY KEY (id);


--
-- Name: user_logins_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_logins
    ADD CONSTRAINT user_logins_id PRIMARY KEY (id);


--
-- Name: user_notification_settings_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_notification_settings
    ADD CONSTRAINT user_notification_settings_id PRIMARY KEY (id);


--
-- Name: users_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_id PRIMARY KEY (id);


--
-- Name: activities_owner_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activities_owner_user_id ON activities USING btree (owner_user_id);


--
-- Name: activities_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activities_user_id ON activities USING btree (user_id);


--
-- Name: cities_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cities_slug ON cities USING btree (slug);


--
-- Name: flags_flag_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flags_flag_category_id ON flags USING btree (flag_category_id);


--
-- Name: flags_flagged_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flags_flagged_user_id ON flags USING btree (flagged_user_id);


--
-- Name: flags_ip_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flags_ip_id ON flags USING btree (ip_id);


--
-- Name: flags_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flags_user_id ON flags USING btree (user_id);


--
-- Name: messages_message_content_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_message_content_id ON messages USING btree (message_content_id);


--
-- Name: messages_other_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_other_user_id ON messages USING btree (other_user_id);


--
-- Name: messages_parent_message_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_parent_message_id ON messages USING btree (parent_message_id);


--
-- Name: messages_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_user_id ON messages USING btree (user_id);


--
-- Name: pages_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_slug ON pages USING btree (slug);


--
-- Name: photo_comments_ip_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX photo_comments_ip_id ON photo_comments USING btree (ip_id);


--
-- Name: photo_comments_photo_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX photo_comments_photo_id ON photo_comments USING btree (photo_id);


--
-- Name: photo_comments_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX photo_comments_user_id ON photo_comments USING btree (user_id);


--
-- Name: photo_likes_ip_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX photo_likes_ip_id ON photo_likes USING btree (ip_id);


--
-- Name: photo_likes_photo_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX photo_likes_photo_id ON photo_likes USING btree (photo_id);


--
-- Name: photo_likes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX photo_likes_user_id ON photo_likes USING btree (user_id);


--
-- Name: photo_views_ip_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX photo_views_ip_id ON photo_views USING btree (ip_id);


--
-- Name: photo_views_photo_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX photo_views_photo_id ON photo_views USING btree (photo_id);


--
-- Name: photo_views_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX photo_views_user_id ON photo_views USING btree (user_id);


--
-- Name: photos_photo_tags_photo_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX photos_photo_tags_photo_id ON photos_photo_tags USING btree (photo_id);


--
-- Name: photos_photo_tags_photo_tag_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX photos_photo_tags_photo_tag_id ON photos_photo_tags USING btree (photo_tag_id);


--
-- Name: photos_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX photos_user_id ON photos USING btree (user_id);


--
-- Name: provider_users_foreign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX provider_users_foreign_id ON provider_users USING btree (foreign_id);


--
-- Name: states_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX states_slug ON states USING btree (slug);


--
-- Name: user_follows_following_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_follows_following_user_id ON user_follows USING btree (other_user_id);


--
-- Name: user_follows_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_follows_user_id ON user_follows USING btree (user_id);


--
-- Name: user_logins_ip_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_logins_ip_id ON user_logins USING btree (ip_id);


--
-- Name: user_logins_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_logins_user_id ON user_logins USING btree (user_id);


--
-- Name: user_notification_settings_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_notification_settings_user_id ON user_notification_settings USING btree (user_id);


--
-- Name: activities_owner_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY activities
    ADD CONSTRAINT activities_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY activities
    ADD CONSTRAINT activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: messages_other_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT messages_other_user_id_fkey FOREIGN KEY (other_user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: messages_parent_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT messages_parent_message_id_fkey FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE CASCADE;


--
-- Name: messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: photo_comments_ip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photo_comments
    ADD CONSTRAINT photo_comments_ip_id_fkey FOREIGN KEY (ip_id) REFERENCES ips(id) ON DELETE SET NULL;


--
-- Name: photo_comments_photo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photo_comments
    ADD CONSTRAINT photo_comments_photo_id_fkey FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE;


--
-- Name: photo_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photo_comments
    ADD CONSTRAINT photo_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: photo_likes_ip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photo_likes
    ADD CONSTRAINT photo_likes_ip_id_fkey FOREIGN KEY (ip_id) REFERENCES ips(id) ON DELETE SET NULL;


--
-- Name: photo_likes_photo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photo_likes
    ADD CONSTRAINT photo_likes_photo_id_fkey FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE;


--
-- Name: photo_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photo_likes
    ADD CONSTRAINT photo_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: photo_views_ip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photo_views
    ADD CONSTRAINT photo_views_ip_id_fkey FOREIGN KEY (ip_id) REFERENCES ips(id) ON DELETE SET NULL;


--
-- Name: photo_views_photo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photo_views
    ADD CONSTRAINT photo_views_photo_id_fkey FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE;


--
-- Name: photo_views_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photo_views
    ADD CONSTRAINT photo_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;


--
-- Name: photos_photo_tags_photo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photos_photo_tags
    ADD CONSTRAINT photos_photo_tags_photo_id_fkey FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE;


--
-- Name: photos_photo_tags_photo_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photos_photo_tags
    ADD CONSTRAINT photos_photo_tags_photo_tag_id_fkey FOREIGN KEY (photo_tag_id) REFERENCES photo_tags(id) ON DELETE CASCADE;


--
-- Name: photos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY photos
    ADD CONSTRAINT photos_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: user_follows_following_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_follows
    ADD CONSTRAINT user_follows_following_user_id_fkey FOREIGN KEY (other_user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: user_follows_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_follows
    ADD CONSTRAINT user_follows_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: user_logins_ip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_logins
    ADD CONSTRAINT user_logins_ip_id_fkey FOREIGN KEY (ip_id) REFERENCES ips(id) ON DELETE SET NULL;


--
-- Name: user_logins_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_logins
    ADD CONSTRAINT user_logins_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: user_notification_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY user_notification_settings
    ADD CONSTRAINT user_notification_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: public; Type: ACL; Schema: -; Owner: -
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

