--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.0

-- Started on 2026-06-22 12:13:59

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
-- TOC entry 219 (class 1259 OID 16408)
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
-- TOC entry 218 (class 1259 OID 16407)
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
-- Dependencies: 218
-- Name: Publicaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Publicaciones_id_seq" OWNED BY public."Publicaciones".id;


--
-- TOC entry 217 (class 1259 OID 16399)
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
-- TOC entry 216 (class 1259 OID 16398)
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
-- Dependencies: 216
-- Name: Usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Usuarios_id_seq" OWNED BY public."Usuarios".id;


--
-- TOC entry 4639 (class 2604 OID 16411)
-- Name: Publicaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Publicaciones" ALTER COLUMN id SET DEFAULT nextval('public."Publicaciones_id_seq"'::regclass);


--
-- TOC entry 4638 (class 2604 OID 16402)
-- Name: Usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios" ALTER COLUMN id SET DEFAULT nextval('public."Usuarios_id_seq"'::regclass);


--
-- TOC entry 4793 (class 0 OID 16408)
-- Dependencies: 219
-- Data for Name: Publicaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4791 (class 0 OID 16399)
-- Dependencies: 217
-- Data for Name: Usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Usuarios" VALUES (0, 'jazarbe', 'Jazmin Arias', 'jazmin@gmail.com', 'prueba1', 'default.jpg', NULL);
INSERT INTO public."Usuarios" VALUES (1, 'ddpyi', 'Diana Park', 'diana@gmail.com', 'holadai', 'default.jpg', NULL);


--
-- TOC entry 4801 (class 0 OID 0)
-- Dependencies: 218
-- Name: Publicaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Publicaciones_id_seq"', 1, false);


--
-- TOC entry 4802 (class 0 OID 0)
-- Dependencies: 216
-- Name: Usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Usuarios_id_seq"', 1, false);


--
-- TOC entry 4645 (class 2606 OID 16417)
-- Name: Publicaciones Publicaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Publicaciones"
    ADD CONSTRAINT "Publicaciones_pkey" PRIMARY KEY (id);


--
-- TOC entry 4643 (class 2606 OID 16406)
-- Name: Usuarios Usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_pkey" PRIMARY KEY (id);


--
-- TOC entry 4646 (class 2606 OID 16418)
-- Name: Publicaciones Publicaciones_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Publicaciones"
    ADD CONSTRAINT "Publicaciones_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Usuarios"(id) ON DELETE CASCADE;


-- Completed on 2026-06-22 12:13:59

--
-- PostgreSQL database dump complete
--

