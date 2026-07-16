--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.0

-- Started on 2026-07-16 11:57:40

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
-- TOC entry 216 (class 1259 OID 16423)
-- Name: Publicaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Publicaciones" (
    id integer NOT NULL,
    url_image character varying(255) NOT NULL,
    description text,
    likes integer DEFAULT 0,
    "creation:date" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public."Publicaciones" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16430)
-- Name: Publicaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Publicaciones_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Publicaciones_id_seq" OWNER TO postgres;

--
-- TOC entry 4799 (class 0 OID 0)
-- Dependencies: 217
-- Name: Publicaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Publicaciones_id_seq" OWNED BY public."Publicaciones".id;


--
-- TOC entry 218 (class 1259 OID 16431)
-- Name: Usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Usuarios" (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    fullname character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    pfp character varying(255),
    bio text
);


ALTER TABLE public."Usuarios" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16436)
-- Name: Usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Usuarios_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Usuarios_id_seq" OWNER TO postgres;

--
-- TOC entry 4800 (class 0 OID 0)
-- Dependencies: 219
-- Name: Usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Usuarios_id_seq" OWNED BY public."Usuarios".id;


--
-- TOC entry 4638 (class 2604 OID 16437)
-- Name: Publicaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Publicaciones" ALTER COLUMN id SET DEFAULT nextval('public."Publicaciones_id_seq"'::regclass);


--
-- TOC entry 4641 (class 2604 OID 16438)
-- Name: Usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios" ALTER COLUMN id SET DEFAULT nextval('public."Usuarios_id_seq"'::regclass);


--
-- TOC entry 4790 (class 0 OID 16423)
-- Dependencies: 216
-- Data for Name: Publicaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Publicaciones" VALUES (1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7gaSm6PWr-vBvW94c4oFUZeDuyq9CVA6Yv7IRsiQJJQ&s=10', 'first post', 0, '2026-07-16 11:51:23.276114-03', 0);


--
-- TOC entry 4792 (class 0 OID 16431)
-- Dependencies: 218
-- Data for Name: Usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Usuarios" VALUES (2, 'a', 'a', 'a@mail.com', '$2b$10$JEeqBFBdH/pB0CnUSCL08ezS171yNMEhY4atDs36mM80cZeL2sse6', 'default.jpg', NULL);
INSERT INTO public."Usuarios" VALUES (0, 'jazarbe', 'Jazmin Arias', 'jazmin@gmail.com', '$2b$10$zKDke/URYROsGfgoH1MekeP6U58vWYDNePKCwgLSAMElk3Km1YT2W', 'default.jpg', NULL);
INSERT INTO public."Usuarios" VALUES (1, 'ddpyi', 'Diana Park', 'diana@gmail.com', '$2b$10$NzH0ScuaTYIZ0H6LWgfYFe6BLu1.Lnw8o4E13RFSSB00ufLCBu/EG', 'default.jpg', NULL);


--
-- TOC entry 4801 (class 0 OID 0)
-- Dependencies: 217
-- Name: Publicaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Publicaciones_id_seq"', 1, true);


--
-- TOC entry 4802 (class 0 OID 0)
-- Dependencies: 219
-- Name: Usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Usuarios_id_seq"', 2, true);


--
-- TOC entry 4643 (class 2606 OID 16440)
-- Name: Publicaciones Publicaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Publicaciones"
    ADD CONSTRAINT "Publicaciones_pkey" PRIMARY KEY (id);


--
-- TOC entry 4645 (class 2606 OID 16442)
-- Name: Usuarios Usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_pkey" PRIMARY KEY (id);


--
-- TOC entry 4646 (class 2606 OID 16443)
-- Name: Publicaciones Publicaciones_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Publicaciones"
    ADD CONSTRAINT "Publicaciones_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Usuarios"(id) ON DELETE CASCADE;


-- Completed on 2026-07-16 11:57:41

--
-- PostgreSQL database dump complete
--

