--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (165f042)
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.admins (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.admins OWNER TO neondb_owner;

--
-- Name: model_colors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.model_colors (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    model_id character varying NOT NULL,
    color_id character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.model_colors OWNER TO neondb_owner;

--
-- Name: model_storage_options; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.model_storage_options (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    model_id character varying NOT NULL,
    storage_id character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.model_storage_options OWNER TO neondb_owner;

--
-- Name: page_visits; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.page_visits (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    page text NOT NULL,
    path text NOT NULL,
    user_agent text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.page_visits OWNER TO neondb_owner;

--
-- Name: product_categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_categories (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    name_fa text NOT NULL,
    slug text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_categories OWNER TO neondb_owner;

--
-- Name: product_colors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_colors (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    name_fa text NOT NULL,
    hex_code text,
    "order" integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_colors OWNER TO neondb_owner;

--
-- Name: product_models; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_models (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    category_id character varying NOT NULL,
    name text NOT NULL,
    name_fa text NOT NULL,
    generation text,
    "order" integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_models OWNER TO neondb_owner;

--
-- Name: product_prices; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_prices (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    model_id character varying NOT NULL,
    color_id character varying,
    storage_id character varying,
    price integer DEFAULT 0 NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_prices OWNER TO neondb_owner;

--
-- Name: product_storage_options; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.product_storage_options (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    name_fa text NOT NULL,
    category_id character varying,
    "order" integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_storage_options OWNER TO neondb_owner;

--
-- Name: used_iphones; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.used_iphones (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    model text NOT NULL,
    color text NOT NULL,
    storage text NOT NULL,
    battery_health integer NOT NULL,
    condition text NOT NULL,
    description text NOT NULL,
    price integer NOT NULL,
    image_url text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.used_iphones OWNER TO neondb_owner;

--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.admins (id, username, password) FROM stdin;
a44cd5ab-fc6c-432f-a0ba-069653fccc91	admin	Gisha@2025!Secure
\.


--
-- Data for Name: model_colors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.model_colors (id, model_id, color_id, is_active) FROM stdin;
79cad11e-49da-4c56-a466-56c9c2e16987	a2d5c639-b6cd-43f7-bb51-51f0b0b24194	9e5b0c49-688c-443c-abe8-17b59be9ed88	t
f1f40c47-e0a1-4600-b4c8-7aad5454798b	a2d5c639-b6cd-43f7-bb51-51f0b0b24194	859a6a6f-3f55-4302-b445-613fe78c6560	t
7da2c326-73db-4fe4-894f-10402bd1249f	a2d5c639-b6cd-43f7-bb51-51f0b0b24194	2d3eaa6e-b86d-43ec-98e3-11fa0d71bd40	t
54f51d23-818f-4577-9d35-971e8e9a8da6	a2d5c639-b6cd-43f7-bb51-51f0b0b24194	6843d87a-b59b-43e4-bf60-c58dbb129320	t
91877399-a308-43db-a943-02a6083c11e0	0db982a6-9201-48fa-a250-c81bd932a0ae	9e5b0c49-688c-443c-abe8-17b59be9ed88	t
51705c39-3e58-46e3-99d8-17b681597932	0db982a6-9201-48fa-a250-c81bd932a0ae	859a6a6f-3f55-4302-b445-613fe78c6560	t
5fa16a3c-5e56-4b72-be83-10cdf543fad7	0db982a6-9201-48fa-a250-c81bd932a0ae	2d3eaa6e-b86d-43ec-98e3-11fa0d71bd40	t
7b0ff54c-a84b-4ebe-a705-98c9ed805112	0db982a6-9201-48fa-a250-c81bd932a0ae	6843d87a-b59b-43e4-bf60-c58dbb129320	t
00acfb90-6b97-4f20-a1a2-a33cb58d413d	ab72f4c2-2e94-41ee-b581-aaf76dbf600d	859a6a6f-3f55-4302-b445-613fe78c6560	t
8e5c9810-247e-449a-b4e8-6fb3998453f2	ab72f4c2-2e94-41ee-b581-aaf76dbf600d	a62ccd50-ed7d-4950-82ce-50a3b3e58bf8	t
2ea46b91-8168-4b59-bee4-c0f844434489	ab72f4c2-2e94-41ee-b581-aaf76dbf600d	2c38ed93-da49-4f9e-8d0c-ff950997d380	t
a8497c9b-3eb9-4903-83f6-c5d3751346e9	0da687f9-e980-48be-b154-e7a6f8502ed8	859a6a6f-3f55-4302-b445-613fe78c6560	t
3ee3e195-25ba-4178-a5dd-8ff3264a4d0d	0da687f9-e980-48be-b154-e7a6f8502ed8	a62ccd50-ed7d-4950-82ce-50a3b3e58bf8	t
03b0b396-b291-4d37-bb64-7cc8052bf9f3	0da687f9-e980-48be-b154-e7a6f8502ed8	2c38ed93-da49-4f9e-8d0c-ff950997d380	t
a1c022a4-0747-4a33-aff0-d33463db2773	d467eabd-ca1b-4c4f-bc06-b0fb9a00e37c	859a6a6f-3f55-4302-b445-613fe78c6560	t
4aa26454-62cc-491b-92a6-5d6e93939467	d467eabd-ca1b-4c4f-bc06-b0fb9a00e37c	a62ccd50-ed7d-4950-82ce-50a3b3e58bf8	t
057a56d1-7bc7-4a4c-9b12-f7fc9cb2f9b9	d467eabd-ca1b-4c4f-bc06-b0fb9a00e37c	2c38ed93-da49-4f9e-8d0c-ff950997d380	t
\.


--
-- Data for Name: model_storage_options; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.model_storage_options (id, model_id, storage_id, is_active) FROM stdin;
cd220824-7287-4ba7-acff-54d0b230ebc4	a2d5c639-b6cd-43f7-bb51-51f0b0b24194	1fbae40a-10bd-4116-8846-2a8533856f24	t
6a901fae-fc76-4569-923c-cfbeb58ec078	a2d5c639-b6cd-43f7-bb51-51f0b0b24194	4ef8c52e-e3ff-4456-b3a8-066072631c5f	t
71c4a919-ada7-433d-bf74-665a4abde308	a2d5c639-b6cd-43f7-bb51-51f0b0b24194	504b6b76-5eac-4ab4-a20c-1a33c7395440	t
eafa252c-63ac-45af-ac1d-a0ce4dabbb4d	a2d5c639-b6cd-43f7-bb51-51f0b0b24194	df82037b-969f-45a6-914c-6ddcebdd1b3e	t
2fc1e6f2-cfe1-4373-b0a7-39c08a9861b5	0db982a6-9201-48fa-a250-c81bd932a0ae	1fbae40a-10bd-4116-8846-2a8533856f24	t
9347eb3e-6ddc-4e42-8462-139abc7b255a	0db982a6-9201-48fa-a250-c81bd932a0ae	4ef8c52e-e3ff-4456-b3a8-066072631c5f	t
33527995-2edd-4da4-8f98-e061f24621b7	0db982a6-9201-48fa-a250-c81bd932a0ae	504b6b76-5eac-4ab4-a20c-1a33c7395440	t
78e1d0b2-3a23-4983-b222-1145d7c94ff5	0db982a6-9201-48fa-a250-c81bd932a0ae	df82037b-969f-45a6-914c-6ddcebdd1b3e	t
0ebe3c2d-d799-4169-9a23-912925c933c0	ab72f4c2-2e94-41ee-b581-aaf76dbf600d	1fbae40a-10bd-4116-8846-2a8533856f24	t
fd85e4e9-f962-42dd-92be-e854220d9dd2	ab72f4c2-2e94-41ee-b581-aaf76dbf600d	4ef8c52e-e3ff-4456-b3a8-066072631c5f	t
0d5f4e86-cde3-4335-87c8-2bf48e56d3e9	ab72f4c2-2e94-41ee-b581-aaf76dbf600d	504b6b76-5eac-4ab4-a20c-1a33c7395440	t
728908c3-421a-4132-bafa-53aa0ebda9b2	ab72f4c2-2e94-41ee-b581-aaf76dbf600d	df82037b-969f-45a6-914c-6ddcebdd1b3e	t
377d8520-f8a9-4a69-894d-8a62e3cbba6a	0da687f9-e980-48be-b154-e7a6f8502ed8	1fbae40a-10bd-4116-8846-2a8533856f24	t
e15d279d-09ff-4090-b92c-961b43d0a06e	0da687f9-e980-48be-b154-e7a6f8502ed8	4ef8c52e-e3ff-4456-b3a8-066072631c5f	t
151c1834-805c-4e54-b1c7-06e708928aaf	0da687f9-e980-48be-b154-e7a6f8502ed8	504b6b76-5eac-4ab4-a20c-1a33c7395440	t
d62e47f9-841b-4621-8de9-c2aebd6805e5	0da687f9-e980-48be-b154-e7a6f8502ed8	df82037b-969f-45a6-914c-6ddcebdd1b3e	t
7960b877-6d68-4aa8-99d6-b3a307a85f20	d467eabd-ca1b-4c4f-bc06-b0fb9a00e37c	1fbae40a-10bd-4116-8846-2a8533856f24	t
8a16cd36-6848-4774-961b-d2d696869d6a	d467eabd-ca1b-4c4f-bc06-b0fb9a00e37c	4ef8c52e-e3ff-4456-b3a8-066072631c5f	t
5f9d1f16-4568-4d71-a687-0d0154f8798e	d467eabd-ca1b-4c4f-bc06-b0fb9a00e37c	504b6b76-5eac-4ab4-a20c-1a33c7395440	t
f7cc5150-6642-45c6-98de-76e9993a2735	d467eabd-ca1b-4c4f-bc06-b0fb9a00e37c	df82037b-969f-45a6-914c-6ddcebdd1b3e	t
\.


--
-- Data for Name: page_visits; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.page_visits (id, page, path, user_agent, created_at) FROM stdin;
07b72c9b-3866-436e-a9a3-befda3d358bd	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-19 22:17:04.774481
a596b765-3a83-4e46-96f9-e23fd2129b12	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-10-19 22:17:06.043692
63594cac-49e5-4048-a03b-1f663b1523e4	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-19 22:32:59.225257
6b3adccb-b1cc-41c4-b4ec-e13714aed3e2	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-19 22:40:30.584517
c9e193fc-f1a1-42f3-9ded-40d48bac8b49	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-10-19 22:40:33.251006
c925a583-01a0-4d82-afa4-584d91cba743	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-19 22:42:12.489361
f0d35358-1cc4-4fe9-b1c5-76ef8044a89a	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-19 22:44:09.245225
de6085b9-c9fc-49b8-a9ac-432f59dd7943	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-19 22:44:12.150402
b7c14ebb-974b-4ba9-be0e-3e2cff79a0aa	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-19 22:44:37.364447
b322f4b4-cd54-4176-9fb3-f827d7b79775	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-10-19 22:44:51.479583
1a033df1-b770-497b-8089-a356209267c5	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-19 23:23:12.399184
8c13461d-0f76-4932-9021-53d98978f608	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-10-19 23:23:14.340955
97a06fae-89af-41bc-b7cb-2761369588c8	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-19 23:29:53.132414
b8f82320-a4ed-4e7f-b367-b0ed917b69f3	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-19 23:30:17.032754
b1236703-a650-4632-8378-aea1c8977605	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-19 23:41:32.024317
9ed8e4ad-3546-4bdc-a081-3ecb73d1ae52	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-19 23:42:15.346548
066aadd4-d53a-425a-acd9-2a7e35c36250	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-19 23:42:16.260124
524fa007-3ae1-47b9-8e96-ccb3959de23c	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-20 14:24:10.137364
449c33ae-96c8-42e4-96af-208e087c2204	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-10-20 14:25:37.628365
043871c6-d822-47bf-8e04-44a5530c4601	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-20 14:29:20.078599
0e2e45ed-2740-4c37-855b-5812c0f00713	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-20 14:35:22.432232
37861607-1426-4c35-b3a9-6ad1f03e0ad9	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-20 14:43:40.762627
fdc89b02-3117-4916-9b33-05dbbe3db68e	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-21 19:38:40.056698
cc2f91ad-39cb-4726-b97d-c67a81988838	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-21 19:38:40.221514
cec76300-9827-4237-a72b-21b45439eef4	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-22 01:22:53.843772
67b51341-61d8-417e-9007-f6ed1b1a1da9	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-22 02:50:30.374133
848046a7-cd20-4ce6-8f8b-2734517c90fd	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-22 02:50:30.559411
abd18dfa-02e8-4748-95ad-8eb1f31daeae	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-22 02:53:21.067979
a98a5898-53c1-4d44-b35b-4d77f2aa32ae	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-22 02:53:24.691121
17a29191-384c-47b0-9fb7-91b64aedfd2f	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-22 02:58:36.559876
f23069a3-66b1-4c95-897f-f7d891e2060b	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-22 07:16:47.438179
5eac74a3-6d4e-4a52-9ea8-a4e06534fc72	home	/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.153.3 (iPadOS 26.0.1)	2025-10-22 07:55:48.173546
f11e1e3f-790f-457f-9154-3b4954e1c18a	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-23 16:50:42.457594
1c423b11-edc7-49f4-900e-b1fe969303b4	iphone	/iphone	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-23 16:51:28.939216
f352285a-f297-484c-93e2-42a342dd97c6	used-iphones	/used-iphones	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-23 16:51:55.585751
0081c08d-b72c-48d3-8d2e-497811aee938	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-28 20:05:30.458117
0502ad71-1472-4246-a252-87bfba0c1618	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-28 20:06:26.278086
c8e286bb-19c0-4a24-968a-8f353ef13c21	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 08:59:20.061897
f9f093ae-310b-4ac4-a7cd-6d1238fa2a97	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 09:07:41.697513
7ddd8213-8071-4ec5-882a-3aebb0657d54	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 09:08:53.038343
42aea389-ee91-4aec-9072-8378472644f8	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 09:14:41.422546
bc9621e1-47b8-47a2-8cff-c24981e01970	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 09:25:16.476817
e1410385-3ff7-4790-af95-25605ac1ef94	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 10:01:39.812178
7f2e1361-ddf7-4667-ae3b-8c88414ffb09	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 19:48:29.714045
c9800abd-8812-41de-a4e7-b3263568afa1	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 19:49:40.035785
f4fc598a-8eca-4f33-92b0-497c19cb5502	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 19:51:48.960519
4d57f450-dcec-4013-864a-572317bf6dab	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 19:52:38.350644
a4d02266-41f1-4475-8d54-6e6dd0f61927	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-10-31 19:52:42.184657
d36f26b3-3e22-410a-b299-ede518a306a2	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 20:04:52.2825
c6a2a841-36cd-44ea-8f21-7ed64a470f62	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 20:08:28.964525
83a7b14e-8bfa-4ca7-a642-aaa21db7849f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 20:17:30.825107
7ce3085f-a32d-4ef7-b611-57312bf5869c	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 20:18:19.602021
b98fe282-eb76-42ce-aab3-f106cfa9ad1e	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 20:20:32.459224
92b3e364-5703-45da-a34b-0e41aff0883e	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 20:24:34.379863
a13126e4-0953-4879-aa1e-97ccf18ed7cc	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 20:30:24.779982
12333eb4-294f-4104-9b3a-7c75ffabab70	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 20:34:49.429203
59c25beb-f05f-44fd-ac6c-1a045cb537c9	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 21:02:48.90552
6c05f93c-e3a2-41fe-ba90-f4ffadc74f6d	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 21:15:07.533986
e6f1c9e5-7abd-40b7-b0d4-325928cde918	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 21:45:07.843867
44e9dfec-4bdb-4b6e-a864-f2a17a79f70d	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 21:53:08.53465
ec2ec03a-0d04-4b47-81bf-ae4e78193dbc	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-10-31 21:59:47.085859
f538fc1f-7296-4634-bcdb-9aef721e38bf	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 12:05:06.810849
babca5d5-5840-4db9-8595-eab7befab784	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 12:49:30.618089
d86587b2-6d38-46fa-80f8-408c03d159fe	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 12:50:00.340374
9292e369-5e40-47f9-b22e-6284dc8caac0	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-01 12:50:02.515275
7695f20d-4b05-4a36-b266-fcfce7dda644	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 13:02:38.570736
a6d66ccd-25df-48ff-b72f-3e11f8e5f2bb	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 13:11:59.777695
98ffae19-b287-4751-8c5a-0d3764edfe82	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 13:14:45.630366
dcf5b13b-6b5e-4537-b602-6ea70bb3ba72	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 13:21:51.674272
a1cc9470-9209-40b6-9ec8-4bcad4af5231	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 13:26:05.983612
24cd1ef1-bfed-4315-bab8-4370d32f7165	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 13:27:26.988284
13a2a3d8-c4ba-4b3f-8165-9715566f91de	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 13:31:41.806387
d01d3e5b-f3d3-4795-a371-4995384f79f9	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 13:35:18.647269
7c6c544b-c6a3-403a-a814-a0871ca0c395	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 13:36:31.105608
29de15bc-ad75-480b-9dee-09a12d34164a	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 13:37:16.032946
b9d83a31-44e6-4aa4-bd80-635c7c0ad137	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 13:38:51.212731
b2291b2b-70bf-4872-8d77-f6d0be7dffe2	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 13:40:22.94109
90a68cf9-747d-4640-bd3c-4659a38499cf	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 14:08:28.871387
1bde292a-fa9b-4fa3-b148-d4e80e41a17b	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 14:10:50.642625
97c14430-ad3a-42dd-a822-643c1f00a748	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 14:14:03.372341
7617a88d-8ac4-4598-a543-35c4d168042b	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 14:50:09.980337
f87679db-4c1c-4666-b36b-c2aecd36471c	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 14:51:24.209795
5061a012-73aa-4242-a33a-15ce7572f79f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 14:52:48.561509
6c27bd24-a072-4775-8b29-9cc4d6c20d3b	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 15:16:00.449158
611a9d0f-c96e-477a-8ae9-bcd60f1b2595	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 15:34:06.610527
0679477d-3ca8-4218-b015-40fc1ef6d430	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 16:02:25.38768
e0b732be-c20a-400a-9383-ec94e54a7f05	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 16:30:35.078462
6a6697e8-a5ba-4245-86b0-c8733479fbe4	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 17:45:22.002212
c5b258c0-5096-4387-8eb5-c308d582e026	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 19:08:18.662824
7b93c8a9-3ba7-48cd-b150-b5398205e3b7	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 19:09:36.322455
a24bff47-4b35-4c3e-8fda-a1d2a4c2a3b7	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 19:10:49.746519
91896413-0165-4813-82cf-97426e7d5bc2	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 20:31:05.965201
0296f207-00e6-475b-905e-4a7188bba772	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 20:49:41.207399
0ec1857d-b1cb-465d-b7da-0b48e53e8b9a	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 21:08:14.95724
093e7dfb-ae8a-432b-af1d-1025ee0b6ed6	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-01 21:14:42.130548
283d3206-22c9-4cb7-bfe4-5ccffa4eed7a	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 11:34:25.368756
1c996ba8-b1e6-47a5-b0c5-3b4d9f136523	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 11:34:57.888922
10ffa877-1519-4195-889e-d703c92ec0e0	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 11:38:45.812843
3490f594-834e-4823-81bf-63a997bd69ba	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 11:52:39.169271
9d7a9420-2de0-4470-870b-365bf17a8883	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 12:09:14.965822
1876dc5e-7a5d-41d7-8f1e-460fb7c99490	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 12:22:13.867409
6bea8cac-8fb2-4079-a269-ab71f438ae68	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 12:24:44.568883
e3df02a7-f0bf-4080-8a4c-fedefaf65d59	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 12:33:22.624254
3557abfa-2ac4-485d-996b-b5a6d92008cb	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 12:36:22.082933
896dab86-487b-422d-b9a3-47cb6a2070ae	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 12:46:50.737789
b0eff22c-196a-4b9d-963d-b45ef94511b4	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 12:57:58.738957
7c7109dc-4fbc-4a02-bf2a-ebc798b121c5	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 13:27:14.179705
1e46bea6-92cd-4d97-8eae-ccc93e9e677f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 14:20:26.125332
ddd64dc5-308c-4336-bcb7-cca37942f427	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 14:42:50.143561
3c1cd691-9757-4e82-9c77-906d01494c7d	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 15:49:54.362713
17ba03eb-5037-412f-8bc7-41e082e812bb	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 16:49:52.344714
2e581a3c-0e4c-4dad-8b3c-a300ec0608c6	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 16:52:21.362606
5505086b-b822-4650-9970-96beea73b35a	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 20:22:51.795909
651a9c4f-2edd-4f3e-9dec-063e562c25a6	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-02 20:22:55.4489
555586da-dda5-4f85-8e74-fdd2a0fe6132	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 20:41:26.380948
877d166c-7f54-4097-b827-963a4e09fe52	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 20:59:01.880409
5a620e66-2fc1-4901-ad98-78ca539959fd	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 21:17:40.239722
63b3d15c-9283-4779-bedc-b8f20660236d	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 21:42:54.744559
ea4b6991-349b-4f93-b638-2d526be2628c	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 23:06:02.688289
a64fa5dd-48a9-48a3-ac1d-80d7def58faa	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-02 23:24:06.874432
bf997177-1601-4e07-a026-db6c9f4c1750	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 05:34:39.871402
a009943b-bdf1-4eba-84d9-c8eb5d0023d3	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 05:40:31.227977
87889837-5002-4832-8ae4-caef3cb44013	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 05:46:12.102021
f663da0c-74ba-4325-80fb-5da7305a36a7	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-03 05:46:38.037002
dd3e239a-e37e-48b7-bc9d-0ae015340196	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 05:46:40.609674
d8270f63-54e4-434e-b7c8-aeaf5e91f3b7	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-03 05:46:40.897957
8339a30a-327e-434d-8e31-3adf09380559	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 05:46:43.317552
c3e2286d-e0a2-491d-8576-b0054803cbb8	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 05:48:25.980276
f8fea779-9b37-49a4-8d40-037e8a239bae	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 05:49:25.834291
c15a039e-0312-4bd6-b9b4-f34e00c3ef0b	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 05:54:33.611326
ce8a635b-cdc4-4d8c-89ec-d79c783a0789	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 05:55:10.490426
bdb1f9b3-dd06-411a-ac49-b862fcc235d4	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 06:02:42.75359
5e81c0f9-1f37-4336-8c0d-1bad114765be	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 06:12:52.632617
8fafad40-ff9b-4e6e-9915-f2ba4b005762	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 06:19:08.690285
341d0ad3-da5e-4a2b-bfc9-0a5e46153b41	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 06:22:29.841613
10699bef-946a-4758-b189-817a4f6991f0	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 06:24:30.719706
a48f4f89-0aca-4878-8c1b-66d5259ae726	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 06:25:50.277685
a699a20c-284c-44a0-be26-d317bb06ddf1	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 06:30:40.09706
d47ff821-10c9-4dea-b318-f018eb6079e8	used-iphones	/used-iphones	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 06:30:53.822595
c8f0aeb4-d935-4a0e-90a3-ab5ef534b1df	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 06:35:52.046657
69dd8434-446e-4f4c-a1f2-21b46bea1c36	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 06:41:10.567136
9dbd73e3-2e50-4cc2-a365-66191a8e41cf	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 06:49:08.006941
672cabff-5544-47df-a2ce-82cebac6773f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 06:59:22.128977
ce2822d4-8c60-4630-a0c1-c49566075509	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 07:00:14.330362
3884e2c8-d820-4dba-b57e-c97e4aad1aa2	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 07:10:42.176149
4a7a7991-690c-4b8c-97ba-a1ba2225de57	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 17:30:55.300195
7e87cae2-b92e-4477-aae0-672e639eb755	used-iphones	/used-iphones	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 17:31:53.360934
1d9866f7-4159-4e65-afeb-1a94c7fdefe2	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 17:33:11.081164
7cb08bc2-20cc-4b42-b665-10ffa157eec0	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 17:34:52.07427
153ed9f2-ea81-413f-8bc1-73a8f382234b	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-03 17:34:53.962652
ebdcae5b-072b-421d-b5ed-801b7f20d16e	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 17:44:14.470742
3d0ca586-abf2-4f93-9e24-f3bc14ba37d8	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 18:08:23.030474
70d9b54a-7b07-4b64-bfe7-bf8b264e1db9	used-iphones	/used-iphones	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 18:13:51.96344
99fe8f88-a0c4-48bc-b98b-c6a1cbb89277	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 18:15:54.92444
75abc070-260d-436e-aa62-a9a46585e2c4	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 18:18:40.161025
4710b6a0-b69e-49dd-a30b-8a1605036698	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 18:31:59.451298
a766369c-ba7c-4343-8ae7-924cd901a921	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 18:34:37.158737
04b36d08-14b1-4d19-a480-dd754e9c9544	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 18:47:18.25821
5852e99a-c3a0-4b80-8685-6cd93866baf8	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 18:55:44.640368
c98d4dde-2824-4130-8590-731ae933c426	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 18:58:02.723582
13b2a05c-dea9-424d-ae75-28c50cc35e8e	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 19:24:57.481214
be39cff5-18d8-4fd7-ac58-5a4b6e86ebc0	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 19:30:27.945409
4848fb40-0f3f-4723-895f-4694fbe78bc0	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 19:44:13.080319
683347ac-e34c-41e9-b6f9-ae2aadfdb1dc	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 19:51:30.313755
bcb61104-f605-4bfe-8ec3-9d528ab4dd3c	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 19:52:54.095353
cb5831bb-f44d-4bf0-8cf2-3a93732e8a5e	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 19:57:16.786969
c72b79a2-cb86-4d84-a235-993e4567ddac	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 20:04:01.785633
b86416e5-9e69-42ee-babb-956ffb3a19df	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 20:12:28.206172
e7944da0-6444-4dd6-a0b0-0adef8177699	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 20:50:21.923844
f1eeffd1-fc33-4785-a62d-3daf51b6d621	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 21:01:59.380253
b5282687-0f47-4279-8004-d2cfd438409f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 21:12:13.270281
d0546954-0aa2-4f3d-bc7f-5b31265fcfdd	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 21:12:45.851642
4f3c5f4d-27d5-44a9-b5a6-faf435b0ba44	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 21:17:34.501446
b67c6340-9c37-4650-9142-af93af78b8fe	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 21:23:12.401928
e05476c9-98e1-4fbe-98cf-ae8a3b5b11bb	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 21:24:36.049165
25e31ef1-87d7-40d9-a19f-65852d7bd514	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 21:24:49.396696
8b8484fa-f05a-4b5b-aaca-4df02d3cb3c3	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 21:46:50.823199
909c5024-635b-4a0f-915f-1121ae06e57d	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 21:48:28.535701
6c61f8c2-9a12-47ec-8f09-3db019ffed9f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 21:52:10.950076
d87af7ed-37d6-479f-9dad-a1a35f793034	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 21:56:49.377941
4a57d4b8-bc19-4821-b5d7-e2ac9a50b76b	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 22:01:05.408868
a3e31911-ae2b-47e2-b8a0-e8f92256eda9	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 22:18:21.995591
41e52111-ac7d-4446-b6db-b22473f32a2a	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 22:21:41.638989
8576940b-7681-441b-82c7-9dfc4e123fb3	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 22:33:38.369427
60777db8-f897-45aa-92a8-b74118d646e0	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 22:34:13.763186
289412ba-4306-4679-9716-aff8ae0e8e1f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 22:34:37.296352
076ccb2b-1c9a-4425-8c55-77377b8a6081	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 22:37:14.151881
fdb379b3-7379-4fb4-a547-1940076773ad	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 22:38:52.237192
5d4ac3cc-ec64-4031-8025-3f8ef5464623	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-03 22:38:53.576636
28a19eb3-9d95-46d3-8070-4fba947f2199	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 22:43:20.413245
0f101c3b-c602-4370-af75-ea5629580bb9	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 22:45:14.145601
40253291-1e27-4083-b9e8-04f6744160b8	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 22:46:33.761773
ef3d5413-c8ec-4902-92e3-9273dd50ad25	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 22:57:05.988333
e7ad9caf-44c2-49e4-882a-122fa379fab6	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 23:11:56.125726
b1fccee9-44d2-4ef1-850e-69df6f19d345	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 23:21:28.875822
e091deae-a74d-447f-a90a-d34fdcc64802	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 23:39:05.250074
f6991b51-fa41-40fa-ac2a-5631aeaa157e	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 23:52:44.391926
7b047acd-b0a4-4a78-b8e8-f206ab5ff4a7	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 23:55:42.849444
abfc7e0c-d0ef-4a70-ac7c-edfbf8b91228	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-03 23:57:38.49165
e623d0f0-a833-452b-b9f0-f0f2dcdf49b6	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 00:02:24.872692
9b4d48a0-d0bb-4ae6-8db1-05565f4a151e	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-04 00:02:28.829091
dd9af77b-c058-451f-a38f-9dffbda2366a	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 00:15:54.120777
3a0f21e7-ad5f-4e31-8f8b-7ee92f6b63c6	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 00:17:29.846863
87f08e47-c4e2-416c-a55e-03b53e707876	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 00:17:49.201104
d17e983f-74d9-4624-8101-f4f780dd0b7b	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 00:21:02.59617
0bf72f71-6ae1-45ac-baad-e57c3b0e2c17	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 00:22:27.397828
2707f244-db59-42ab-afa3-c589a625a0a0	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 00:22:47.763284
95b1cf31-f993-4909-885f-124ea1e89f2b	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 00:30:11.377218
5a513e99-a29d-4202-8327-b66c026d77ed	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 00:31:00.352101
614b4eab-8968-47c8-bd56-40970558e411	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 00:34:50.361986
ce358400-c278-4a5a-9133-58c7c6d992b9	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 00:36:50.808155
65b8ff1d-ced1-45ef-bbf8-b958b48bf61f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 00:47:09.624875
9b05e28f-9e14-456d-a1eb-901bcf98316e	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 00:49:21.862342
7c4c7f77-c0bb-4994-9b79-1341a394dd1c	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 00:52:19.43109
ebc0a78b-c903-40f8-954b-4b2e5aa418a1	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 01:04:15.69376
bc9697b5-386e-496c-8b3c-cf14f1a9b20a	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 01:10:04.685567
229e94b9-6f5d-4d08-b772-0d3cee51b466	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 01:27:52.80355
73509422-dbf8-42fc-801d-17b03ebfb09c	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 01:30:46.184515
bee52e1b-a24c-45aa-b802-dcc5cc3a4e71	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 01:32:48.936464
7c2e9a9e-7c6c-4207-9f9f-4d0be3bc178d	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 01:36:49.395717
34b11706-3baf-4fe4-80cd-198c610a25d9	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 18:13:38.010894
919229ed-5dcf-415e-80c6-a2da7699ed78	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 18:40:55.025394
1becc23f-2f55-4805-8ca4-a4a754ac801b	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-04 21:43:38.299216
8a688e8c-1de1-499f-8487-220e72be3655	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-04 22:44:58.999543
fce5d5cc-4033-443a-a43a-58c3e3ad890c	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-04 22:58:07.945979
30f53516-fbfc-444c-9517-484cac206b4a	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-04 22:58:14.049119
a5f6f9e7-656a-48c4-852c-cec5aac47f14	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-04 23:15:11.368794
b8f2b830-fef2-4b02-942e-05407e237077	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-05 00:49:19.002105
944cf9ec-8eaf-46ac-92c4-f4fc16cc94d4	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-05 12:23:56.956705
87e18e17-d334-4e3c-9ee5-72bd02def694	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-05 12:28:22.762613
03fe2a5a-7a7c-492f-b5d7-298299050e8a	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 12:28:26.554402
c0128284-7695-4f8b-9877-48ec209c39ca	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 12:41:01.774201
5a002e85-41ad-4f69-8335-8cc1af0bd259	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 12:58:36.177764
ae2178d0-abcc-4741-a079-db555b2861fd	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 12:58:36.398212
37db6e4c-7044-4202-98f3-4e8ff918b5ce	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:00:52.702004
4ebe9ade-f32a-4d97-95c5-9e9f843f2d38	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:00:53.199016
568da7b1-d22a-480b-aba9-6f43b0488778	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:01:13.408712
17f03b39-bfa9-4210-97ff-40e1feb2d348	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:02:09.372669
aa3f36a6-997e-4d15-a565-862b8a664803	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:02:09.553706
2025954c-c4bb-4549-9d1a-0f7c202bb0d3	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-05 13:02:10.280142
c7c2bfc9-4dec-4716-aab4-60a0830bc318	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:04:29.305471
9a757832-f0ca-4657-b9b8-7f4efbefa036	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:05:11.674884
490ee573-bb90-42ce-9087-a717ac1e2102	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:09:09.894409
38f64545-a904-469a-9b53-6818bcb11bff	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-05 13:09:12.488641
6a60f7e3-2138-48a8-af07-40dbb7a5a5a6	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:09:28.428392
78ffe2d2-1664-4acb-9a84-b3e3e582b5ed	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:12:07.475974
b5d16346-c15f-45dd-9afa-c6b196c14092	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:12:35.535925
8cdf9d67-a674-4c53-bc50-870cddf4f83f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:14:34.135755
9440157a-74ca-4064-bc90-7ca890e1fc89	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:14:43.62355
32fbcf6c-a612-4987-ae0b-468a24444f2d	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:14:57.989207
f85f39f3-ae27-4fbd-a707-fc943417c196	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:15:00.203939
42a26947-1b9f-4331-96ec-79b61462963d	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-05 13:17:48.964498
d8d6f37a-ff0c-4e77-b0a7-95b25431a146	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:20:57.631013
4770c70e-2411-4740-b603-9fab8a7856ab	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:21:47.589612
61718992-7958-4c6c-a9ea-79ce40d5eb4f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:26:40.083513
2374aa80-38b0-44b8-baa4-263aeaf230d3	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:26:41.46445
730cc321-ac6d-401f-9fa2-cf8ac110b7c7	contact	/contact	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:26:57.236184
44274552-c38c-4c8f-bb0a-13e96fb1b70e	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:30:12.910132
7de6d48a-3703-4f1e-a9a0-3bfd9c9a1d4f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:31:05.879172
46eef7f3-2a32-4ea1-b5ef-64420112360b	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-05 13:31:24.158523
b964ab2e-c47c-4c73-8abb-2e69a2c6ff57	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:31:27.850056
f02472a6-4dfd-4d57-a482-5a46500e225e	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:32:14.736343
2b22be56-7161-46c5-8fc1-9d5ca237861b	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:33:11.525981
a4da3023-4ea7-4780-9671-58150350d99d	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:33:58.274938
26ab4da6-336a-44e6-8233-93633f592e9e	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:33:58.845464
a6b7e03b-e5c3-43a2-b0ca-ec10195f0358	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 13:53:36.563387
9c51a067-3a81-47c4-8dd7-9a55e0383d4a	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 14:16:11.231372
7fc1be80-a073-4fc9-b010-db29f3c6e010	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-05 18:58:24.261134
30f83d55-1c09-4571-a1d7-a582f15e7894	home	/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Replit/1.0.14 Chrome/124.0.6367.119 Electron/30.0.3 Safari/537.36	2025-11-05 19:35:13.489442
3d679949-0dfc-4919-b4ef-21871292e264	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 19:44:53.560208
cbdccbaf-1bac-43a5-b9b9-8ffde015aa54	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 20:02:56.293286
df7c3f2d-66d0-47dd-9385-5aac4f5e8afa	home	/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Replit/1.0.14 Chrome/124.0.6367.119 Electron/30.0.3 Safari/537.36	2025-11-05 20:07:04.619243
dceebdd1-2622-4abb-9c07-da09f8eaeb9f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 20:44:56.389069
d794c633-fd49-4449-9d6d-e0ad96f4c0db	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 21:11:41.249048
6e397ca8-213d-4987-a37c-9152b3e05227	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 21:30:17.938572
ac330bec-b5f6-4d7b-9865-b881106f670f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 21:32:17.836559
8339838c-6d34-405e-bf3b-9cb056ab3e9c	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 21:41:57.90271
3714f921-05b8-43e0-935c-34b210b1e1de	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 21:42:48.51476
7fc5605e-1f57-4064-9daa-986ffc54a5d5	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 21:43:33.938463
2b4174dc-4b20-4151-8924-804dd7dd29e1	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 21:46:09.998301
8f1ef39f-62bc-4e9c-94cc-7761a2919074	iphone	/iphone	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 21:46:10.991661
e7f36503-32e6-4f6f-a8e2-92dd807f88fd	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 21:47:21.092495
e4edde72-b079-4034-8ccb-bf4d67890b95	iphone	/iphone	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 21:47:23.955192
bbad6aa5-8d8b-4da8-9a25-93454c04e5e0	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-05 21:47:24.69681
04485a2e-30ba-4359-a310-764d6f70015a	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-05 21:51:01.921126
e33cf579-1ae2-4d72-9175-cd494642bf94	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 21:56:28.884077
f82b1922-d52c-4cbc-8a9c-50ec4ee6733e	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 22:01:40.109981
5b207205-aa71-466e-8246-61c887dc1ad6	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 22:05:29.959607
48a080d3-ac9d-4ba0-aab5-a21591bcd643	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 22:17:36.059715
0c65a213-b8c6-4717-874b-c5b331945151	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 22:19:10.211173
9106c918-4e80-486e-99f5-a7c80aa487f2	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 22:35:17.554301
77a42f2b-a2ec-4c0e-b56c-7a13f8ad3650	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 22:35:34.612539
86485ace-559f-42ba-b1d7-9bb394ee51d8	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 22:54:10.003395
651d9165-d50d-424c-9cc3-31caf1055bf7	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 23:02:16.4527
f03c68cf-5ab4-421f-9af8-6d4bd1b1536f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 23:09:09.414402
75b238b5-6a9a-411c-9471-7c254b0cdeb4	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 23:11:18.89152
06e33cba-dd98-4a0e-9c1d-03c4541d17f3	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 23:38:39.334095
56b53b10-d6c7-437d-a367-42bd169189f4	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-05 23:39:26.659315
daa4d2c2-cca2-47cb-b2b7-bb785ee4df0b	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-05 23:39:57.440681
62d2629d-3110-46d1-a64a-a0d99f0b5dd1	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-05 23:44:01.032744
7fa066bd-a1d6-47c5-98ec-fb5285d6a074	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-05 23:48:39.594998
96e73557-3e0a-40ba-8922-d433519ebe39	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-06 00:34:42.510402
a047d75b-2588-4527-a282-e7866f21ad5f	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 03:30:51.601407
3e36f156-ffe8-4da1-a024-58fff4fa9bbe	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 03:53:12.555828
7b012434-f5bc-46a2-aff8-9be0c8186c41	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 10:31:32.797028
b607a111-0af8-4262-945a-a35b3279ada6	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 10:31:41.158765
19178adc-c5eb-4af8-894a-c28caa16a03b	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 14:05:55.370258
d4d568e7-1939-4e45-a419-149166b20a50	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 14:11:01.087418
454ab2c4-5a54-45ce-9ddd-12bf192b081c	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-06 14:11:06.441689
3f8f144f-4a65-4158-a27b-a799ad6ea371	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 14:15:02.560024
f24fb9af-e5ef-44d2-8ec6-b95aabb45ca4	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 14:28:24.206779
fbea6f95-a4e0-4280-a6f9-42a546fc6d1d	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 21:29:23.667708
f9a7431a-eec6-4459-a294-5ea55e74f638	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 21:36:05.545717
2e131c59-f0ff-4524-8d69-f481eb01797c	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 21:36:57.359902
961ff9d3-b26c-4c4a-ad7f-395fd11e2260	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 21:37:31.957549
2b47ecb4-e3b5-4f93-bf74-a781da805e14	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 21:41:38.179148
57656f7a-cf03-4db1-a88c-6654761e9de3	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 21:47:08.595417
64dce86e-2e2b-4363-9a29-c1c30079d572	iphone	/iphone	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 21:47:22.761235
887fa95e-e9c5-4edc-ac69-7b8e969e12c6	used-iphones	/used-iphones	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 21:47:28.146928
f44f1446-bcf6-458b-93a3-c914233132e3	iphone	/iphone	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 21:47:37.27534
074877ad-4e08-42a6-889c-6e372ca722aa	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 21:48:28.2064
dde42942-c8c2-4d8f-824d-d9cd16cab2cb	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 22:03:54.000334
04f0657b-86de-45a6-8a55-cee720d01048	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 22:11:00.06427
795e5615-064d-4212-aceb-a39e031144d4	home	/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 22:32:07.358188
3f4d6f8a-0660-4a09-97d3-7219da1ec02c	used-iphones	/used-iphones	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1	2025-11-06 22:32:13.193744
0b383438-bb66-4549-894d-03937788c517	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-07 00:16:58.484348
7f047579-7e6d-4b08-a379-bcc2128c3e76	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-07 00:24:15.309132
59495867-424e-4a6b-bd70-cab7840bc8fc	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-07 00:25:07.467205
db16865f-0b2c-45c7-8d33-05d8dc12ca14	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-07 16:42:18.285895
2301c303-ca0a-4848-9a7f-42fcd83e6ffa	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	2025-11-07 19:13:21.972057
c2ef8e5e-b14b-481a-9c48-7fb39c351ff6	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-07 19:13:24.640946
becced0e-c3d3-4796-9494-9569000c018b	iphone	/iphone	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-07 19:14:14.760525
790708b2-728a-4850-9e2d-d6bbe99b6113	contact	/contact	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-07 19:14:53.306413
7be27428-98de-43e0-ad90-943d600930b6	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-07 19:16:28.482128
5aa06325-c3c6-43fd-9ca9-2ded20c17d7b	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-07 19:16:50.754641
571971c1-a60d-415b-95e1-c389e3a20f25	iphone	/iphone	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-07 19:17:43.031273
db38f3e8-afa7-46b6-8ca0-8fd4f1eeef96	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-07 19:18:10.448266
4daecd48-9cc4-4220-9aa5-4486f843ca96	home	/	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-07 19:19:50.843588
86fcc54c-6d47-4362-ad3d-cc1b055b728b	iphone	/iphone	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-07 19:20:15.256239
7177ce63-0601-445c-a03f-65c8db8f8677	used-iphones	/used-iphones	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-07 19:20:42.201302
8342efed-92d1-4d8f-a1f5-30cc8d6626ad	contact	/contact	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	2025-11-07 19:21:10.955344
\.


--
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_categories (id, name, name_fa, slug, "order", is_active, created_at) FROM stdin;
48d4674a-92f0-4708-9162-c095e854b4e5	iPhone	آیفون	iphone	1	t	2025-10-19 22:04:25.804872
dbe7f366-ecc9-4513-9f58-b6b7cd0116bd	iPad	آیپد	ipad	2	t	2025-10-19 22:04:25.854947
f9691b53-d3a8-478b-ac72-2eb4ae7cd549	AirPod	ایرپاد	airpod	3	t	2025-10-19 22:04:25.899736
e6788d43-ff51-442a-8917-7fbff3877b36	Accessories	لوازم جانبی	accessories	4	t	2025-10-19 22:04:25.944114
\.


--
-- Data for Name: product_colors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_colors (id, name, name_fa, hex_code, "order", is_active, created_at) FROM stdin;
9e5b0c49-688c-443c-abe8-17b59be9ed88	Desert	صحرایی	#E5D4C1	1	t	2025-10-19 22:04:26.052989
859a6a6f-3f55-4302-b445-613fe78c6560	White	سفید	#F5F5F7	2	t	2025-10-19 22:04:26.052989
2d3eaa6e-b86d-43ec-98e3-11fa0d71bd40	Black	مشکی	#1D1D1F	3	t	2025-10-19 22:04:26.052989
6843d87a-b59b-43e4-bf60-c58dbb129320	Natural	طبیعی	#D4C5B9	4	t	2025-10-19 22:04:26.052989
a62ccd50-ed7d-4950-82ce-50a3b3e58bf8	Navy	سرمه‌ای	#1B3A57	5	t	2025-10-19 22:04:26.052989
2c38ed93-da49-4f9e-8d0c-ff950997d380	Orange	نارنجی	#FF6B35	6	t	2025-10-19 22:04:26.052989
baa00484-ba2b-4bf8-a69e-553dd26db26f	Space Gray	خاکستری فضایی	#7D7D7D	7	t	2025-10-19 22:04:26.052989
db82684f-8d25-4b7e-b941-afbcd25dfa91	Silver	نقره‌ای	#E3E4E5	8	t	2025-10-19 22:04:26.052989
9e2cf8b0-daac-4d53-988e-c9c678529856	Blue	آبی	#4A90E2	9	t	2025-10-19 22:04:26.052989
624189cc-d8c4-4a90-b38d-5e67222b9466	Purple	بنفش	#9B59B6	10	t	2025-10-19 22:04:26.052989
\.


--
-- Data for Name: product_models; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_models (id, category_id, name, name_fa, generation, "order", is_active, created_at) FROM stdin;
a2d5c639-b6cd-43f7-bb51-51f0b0b24194	48d4674a-92f0-4708-9162-c095e854b4e5	16 Pro Max	۱۶ پرو مکس	iPhone 16	1	t	2025-10-19 22:04:26.103075
0db982a6-9201-48fa-a250-c81bd932a0ae	48d4674a-92f0-4708-9162-c095e854b4e5	16 Pro	۱۶ پرو	iPhone 16	2	t	2025-10-19 22:04:26.150135
ab72f4c2-2e94-41ee-b581-aaf76dbf600d	48d4674a-92f0-4708-9162-c095e854b4e5	17 Pro Max	۱۷ پرو مکس	iPhone 17	3	t	2025-10-19 22:04:26.195704
0da687f9-e980-48be-b154-e7a6f8502ed8	48d4674a-92f0-4708-9162-c095e854b4e5	17 Pro	۱۷ پرو	iPhone 17	4	t	2025-10-19 22:04:26.240117
d467eabd-ca1b-4c4f-bc06-b0fb9a00e37c	48d4674a-92f0-4708-9162-c095e854b4e5	17 Air	۱۷ ایر	iPhone 17	5	t	2025-10-19 22:04:26.284742
84b72ca8-172d-4d8c-8277-7d1d3c03657d	f9691b53-d3a8-478b-ac72-2eb4ae7cd549	AirPod 3	ایرپاد ۳	\N	1	t	2025-10-19 22:04:26.329426
f58c1ff0-ba4d-483d-a27d-a2945b9c6dbc	f9691b53-d3a8-478b-ac72-2eb4ae7cd549	AirPod 4 with Noise Cancelling	ایرپاد ۴ با حذف نویز	\N	2	t	2025-10-19 22:04:26.329426
324a59a5-9bde-453b-a617-bb0127f1d45e	f9691b53-d3a8-478b-ac72-2eb4ae7cd549	AirPod 4 without Noise Cancelling	ایرپاد ۴ بدون حذف نویز	\N	3	t	2025-10-19 22:04:26.329426
be908d61-530c-46f0-a46e-9c48bf0cbeba	f9691b53-d3a8-478b-ac72-2eb4ae7cd549	AirPod Pro 2	ایرپاد پرو ۲	\N	4	t	2025-10-19 22:04:26.329426
56230348-6ee4-497d-8093-ace9649d1b5e	f9691b53-d3a8-478b-ac72-2eb4ae7cd549	AirPod Pro 3	ایرپاد پرو ۳	\N	5	t	2025-10-19 22:04:26.329426
a44cd5ab-fc6c-432f-a0ba-069653fccc91	48d4674a-92f0-4708-9162-c095e854b4e5	16 noemal	۱۶ نرمال	iphone 16	3	t	2025-11-06 00:00:00
\.


--
-- Data for Name: product_prices; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_prices (id, model_id, color_id, storage_id, price, updated_at) FROM stdin;
cffa76d3-b4c0-41d9-941c-8a26aad7cebc	0db982a6-9201-48fa-a250-c81bd932a0ae	9e5b0c49-688c-443c-abe8-17b59be9ed88	4ef8c52e-e3ff-4456-b3a8-066072631c5f	85000000	2025-10-19 23:18:46.13205
\.


--
-- Data for Name: product_storage_options; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.product_storage_options (id, name, name_fa, category_id, "order", is_active, created_at) FROM stdin;
1fbae40a-10bd-4116-8846-2a8533856f24	128GB	۱۲۸ گیگابایت	48d4674a-92f0-4708-9162-c095e854b4e5	1	t	2025-10-19 22:04:25.988266
4ef8c52e-e3ff-4456-b3a8-066072631c5f	256GB	۲۵۶ گیگابایت	48d4674a-92f0-4708-9162-c095e854b4e5	2	t	2025-10-19 22:04:25.988266
504b6b76-5eac-4ab4-a20c-1a33c7395440	512GB	۵۱۲ گیگابایت	48d4674a-92f0-4708-9162-c095e854b4e5	3	t	2025-10-19 22:04:25.988266
df82037b-969f-45a6-914c-6ddcebdd1b3e	1TB	۱ ترابایت	48d4674a-92f0-4708-9162-c095e854b4e5	4	t	2025-10-19 22:04:25.988266
68bfd1aa-5a58-4272-bdc0-718158f0ba92	128GB Wi-Fi	۱۲۸ گیگابایت Wi-Fi	dbe7f366-ecc9-4513-9f58-b6b7cd0116bd	1	t	2025-10-19 22:04:25.988266
f7eebee5-acc8-44e7-b16d-16f272454534	256GB Wi-Fi	۲۵۶ گیگابایت Wi-Fi	dbe7f366-ecc9-4513-9f58-b6b7cd0116bd	2	t	2025-10-19 22:04:25.988266
c846f419-c73b-433c-8d73-688b3844c936	512GB Wi-Fi	۵۱۲ گیگابایت Wi-Fi	dbe7f366-ecc9-4513-9f58-b6b7cd0116bd	3	t	2025-10-19 22:04:25.988266
9f066c91-32bb-491b-8316-0959155c7f10	1TB Wi-Fi	۱ ترابایت Wi-Fi	dbe7f366-ecc9-4513-9f58-b6b7cd0116bd	4	t	2025-10-19 22:04:25.988266
96472c0c-1485-44d7-9d01-9e012a79d20f	128GB Cellular	۱۲۸ گیگابایت Cellular	dbe7f366-ecc9-4513-9f58-b6b7cd0116bd	5	t	2025-10-19 22:04:25.988266
49888c6e-8d49-4bcd-b408-d1cc7b60c688	256GB Cellular	۲۵۶ گیگابایت Cellular	dbe7f366-ecc9-4513-9f58-b6b7cd0116bd	6	t	2025-10-19 22:04:25.988266
9b2fb246-d84e-4822-919e-2e02fe2f2057	512GB Cellular	۵۱۲ گیگابایت Cellular	dbe7f366-ecc9-4513-9f58-b6b7cd0116bd	7	t	2025-10-19 22:04:25.988266
4ffc5605-1832-4468-8147-b997f6fba698	1TB Cellular	۱ ترابایت Cellular	dbe7f366-ecc9-4513-9f58-b6b7cd0116bd	8	t	2025-10-19 22:04:25.988266
\.


--
-- Data for Name: used_iphones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.used_iphones (id, model, color, storage, battery_health, condition, description, price, image_url, created_at) FROM stdin;
72dd3085-5737-4f24-a2b2-56b10c1d8220	iPhone 15 Pro Max Test	طلایی	512GB	100	نو	تست موفق آپلود عکس با Cloudinary	65000000	https://res.cloudinary.com/df9akm3go/image/upload/v1762386608/persian-apple-store/zdvcv1b6oywl5tzvogoh.png	2025-11-05 23:50:20.9836
\.


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: admins admins_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_unique UNIQUE (username);


--
-- Name: model_colors model_colors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.model_colors
    ADD CONSTRAINT model_colors_pkey PRIMARY KEY (id);


--
-- Name: model_storage_options model_storage_options_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.model_storage_options
    ADD CONSTRAINT model_storage_options_pkey PRIMARY KEY (id);


--
-- Name: page_visits page_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.page_visits
    ADD CONSTRAINT page_visits_pkey PRIMARY KEY (id);


--
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- Name: product_categories product_categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_slug_unique UNIQUE (slug);


--
-- Name: product_colors product_colors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_colors
    ADD CONSTRAINT product_colors_pkey PRIMARY KEY (id);


--
-- Name: product_models product_models_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_models
    ADD CONSTRAINT product_models_pkey PRIMARY KEY (id);


--
-- Name: product_prices product_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_prices
    ADD CONSTRAINT product_prices_pkey PRIMARY KEY (id);


--
-- Name: product_storage_options product_storage_options_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_storage_options
    ADD CONSTRAINT product_storage_options_pkey PRIMARY KEY (id);


--
-- Name: used_iphones used_iphones_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.used_iphones
    ADD CONSTRAINT used_iphones_pkey PRIMARY KEY (id);


--
-- Name: model_colors model_colors_color_id_product_colors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.model_colors
    ADD CONSTRAINT model_colors_color_id_product_colors_id_fk FOREIGN KEY (color_id) REFERENCES public.product_colors(id) ON DELETE CASCADE;


--
-- Name: model_colors model_colors_model_id_product_models_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.model_colors
    ADD CONSTRAINT model_colors_model_id_product_models_id_fk FOREIGN KEY (model_id) REFERENCES public.product_models(id) ON DELETE CASCADE;


--
-- Name: model_storage_options model_storage_options_model_id_product_models_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.model_storage_options
    ADD CONSTRAINT model_storage_options_model_id_product_models_id_fk FOREIGN KEY (model_id) REFERENCES public.product_models(id) ON DELETE CASCADE;


--
-- Name: model_storage_options model_storage_options_storage_id_product_storage_options_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.model_storage_options
    ADD CONSTRAINT model_storage_options_storage_id_product_storage_options_id_fk FOREIGN KEY (storage_id) REFERENCES public.product_storage_options(id) ON DELETE CASCADE;


--
-- Name: product_models product_models_category_id_product_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_models
    ADD CONSTRAINT product_models_category_id_product_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.product_categories(id) ON DELETE CASCADE;


--
-- Name: product_prices product_prices_color_id_product_colors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_prices
    ADD CONSTRAINT product_prices_color_id_product_colors_id_fk FOREIGN KEY (color_id) REFERENCES public.product_colors(id) ON DELETE SET NULL;


--
-- Name: product_prices product_prices_model_id_product_models_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_prices
    ADD CONSTRAINT product_prices_model_id_product_models_id_fk FOREIGN KEY (model_id) REFERENCES public.product_models(id) ON DELETE CASCADE;


--
-- Name: product_prices product_prices_storage_id_product_storage_options_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_prices
    ADD CONSTRAINT product_prices_storage_id_product_storage_options_id_fk FOREIGN KEY (storage_id) REFERENCES public.product_storage_options(id) ON DELETE SET NULL;


--
-- Name: product_storage_options product_storage_options_category_id_product_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.product_storage_options
    ADD CONSTRAINT product_storage_options_category_id_product_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.product_categories(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

