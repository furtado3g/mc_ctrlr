import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowRight,
    ArrowUpRight,
    Camera,
    Compass,
    Flag,
    Heart,
    Instagram,
    Menu,
    MessageCircle,
    Route,
    Shield,
    Sparkles,
    Users,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import '../../../css/landing.css';

type Section = {
    key: string;
    title: string;
    body: string;
    image_url?: string | null;
    cta_label?: string | null;
    cta_url?: string | null;
    position: number;
};
type Content = { name: string; sections: Section[] };
const sectionLabels: Record<string, string> = {
    hero: 'Início',
    about: 'O motoclube',
    activities: 'Na estrada',
    instagram: 'Instagram',
    contact: 'Contato',
};
const roadPhoto = '/images/landing/motorcycle-road.jpg';

const instagramPosts = [
    {
        id: 1,
        image: '/images/landing/instagram/insta-1.jpg',
        alt: 'Comboio de motocicletas em rodovia panorâmica de serra',
        caption: 'Bate e fica até a serra. O melhor destino é a companhia de quem roda junto.',
        likes: '384',
        comments: '29',
        tag: '#NaEstrada',
    },
    {
        id: 2,
        image: '/images/landing/instagram/insta-2.jpg',
        alt: 'Detalhe mecânico de motocicleta customizada no asfalto',
        caption: 'Máquinas alinhadas e prontas para a próxima jornada. Cuidado e paixão em cada detalhe.',
        likes: '512',
        comments: '43',
        tag: '#Customização',
    },
    {
        id: 3,
        image: '/images/landing/instagram/insta-3.jpg',
        alt: 'Motociclista apreciando a paisagem em estrada de montanha ao nascer do sol',
        caption: 'O asfalto livre e o horizonte à frente. Sensação que só quem pilota conhece.',
        likes: '467',
        comments: '38',
        tag: '#Liberdade',
    },
    {
        id: 4,
        image: '/images/landing/instagram/insta-4.jpg',
        alt: 'Motocicleta estacionada com vista para o mar em rota costeira',
        caption: 'Parada estratégica na rota costeira. Vento no rosto e espírito renovado.',
        likes: '629',
        comments: '54',
        tag: '#RotaCosteira',
    },
    {
        id: 5,
        image: '/images/landing/instagram/insta-5.jpg',
        alt: 'Motocicletas clássicas alinhadas em ponto de encontro de estrada',
        caption: 'Parceria de estrada: café quente, histórias de viagem e o próximo trajeto planejado.',
        likes: '441',
        comments: '31',
        tag: '#Irmandade',
    },
    {
        id: 6,
        image: '/images/landing/instagram/insta-6.jpg',
        alt: 'Viagem ao pôr do sol em rodovia aberta',
        caption: 'Fim de tarde na rodovia. Voltando para casa com a alma leve e o tanque cheio.',
        likes: '715',
        comments: '62',
        tag: '#PorDoSol',
    },
];

function CallToAction({
    section,
    secondary = false,
}: {
    section: Section;
    secondary?: boolean;
}) {
    if (!section.cta_label || !section.cta_url) return null;
    return (
        <a
            className={`mc-button${secondary ? ' mc-button-outline' : ''}`}
            href={section.cta_url}
        >
            {section.cta_label}
            <ArrowUpRight size={18} aria-hidden="true" />
        </a>
    );
}

function SectionHeading({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <>
            <p className="mc-eyebrow">
                <span />
                {label}
            </p>
            <h2 className="mc-title">{children}</h2>
        </>
    );
}

function SectionContent({
    section,
    hasAbout,
}: {
    section: Section;
    hasAbout: boolean;
}) {
    const paragraphs = section.body
        .split(/\n\s*\n/)
        .filter((text) => text.trim());
    if (section.key === 'hero') {
        return (
            <>
                <section
                    id="hero"
                    className="mc-hero"
                    aria-labelledby="hero-title"
                >
                    <div className="mc-hero-photo">
                        <img
                            src={section.image_url || roadPhoto}
                            alt={
                                section.image_url
                                    ? ''
                                    : 'Imagem ilustrativa de uma motociclista na estrada ao pôr do sol'
                            }
                            fetchPriority="high"
                            width={1920}
                            height={1280}
                        />
                    </div>
                    <div className="mc-container mc-hero-content">
                        <div className="mc-hero-badge">
                            <Sparkles size={13} aria-hidden="true" />
                            <span>Motoclube Oficial · Tradição & Estrada</span>
                        </div>
                        <p className="mc-eyebrow">
                            <span />
                            Liberdade sobre duas rodas
                        </p>
                        <h1 id="hero-title">{section.title}</h1>
                        <p className="mc-hero-body">{section.body}</p>
                        <div className="mc-actions">
                            <CallToAction section={section} />
                            {hasAbout && section.cta_url !== '#about' && (
                                <a className="mc-text-link" href="#about">
                                    Conheça o motoclube{' '}
                                    <ArrowDown size={16} aria-hidden="true" />
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="mc-hero-bottom mc-container">
                        <div className="mc-hero-motto">
                            <Compass size={14} aria-hidden="true" />
                            <span>
                                O caminho tem mais sentido quando é compartilhado.
                            </span>
                        </div>
                        <div className="mc-hero-highlights" aria-hidden="true">
                            <span>✦ ESTRADA</span>
                            <span>✦ IRMANDADE</span>
                            <span>✦ RESPEITO</span>
                        </div>
                        <span className="mc-road-mark" aria-hidden="true">
                            ━━ ━━ ━━
                        </span>
                    </div>
                </section>
                <div className="mc-strip" aria-label="Destaques do motoclube">
                    <div className="mc-container mc-strip-inner">
                        <div className="mc-strip-item">
                            <span className="mc-strip-number">01</span>
                            <div>
                                <strong>Rotas & Viagens</strong>
                                <p>
                                    Passeios regulares e expedições em grupo por
                                    novos caminhos.
                                </p>
                            </div>
                        </div>
                        <div className="mc-strip-item">
                            <span className="mc-strip-number">02</span>
                            <div>
                                <strong>Irmandade & Apoio</strong>
                                <p>
                                    Companheirismo autêntico e suporte mútuo
                                    entre motociclistas.
                                </p>
                            </div>
                        </div>
                        <div className="mc-strip-item">
                            <span className="mc-strip-number">03</span>
                            <div>
                                <strong>Respeito & Tradição</strong>
                                <p>
                                    Pilotagem responsável, disciplina e amor
                                    genuíno pelo asfalto.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    if (section.key === 'about') {
        return (
            <section id="about" className="mc-section mc-about">
                <div className="mc-container mc-about-grid">
                    <div className="mc-about-visual">
                        {section.image_url ? (
                            <img
                                src={section.image_url}
                                alt=""
                                loading="lazy"
                                width={720}
                                height={840}
                            />
                        ) : (
                            <div className="mc-manifesto">
                                <div className="mc-manifesto-badge">
                                    <span>MC · ESTRADA LIVRE</span>
                                </div>
                                <Compass
                                    size={52}
                                    strokeWidth={1.2}
                                    aria-hidden="true"
                                />
                                <p>
                                    O destino é só
                                    <br />
                                    parte da história.
                                </p>
                                <span>A outra parte é quem vai com você.</span>
                                <div
                                    className="mc-manifesto-road"
                                    aria-hidden="true"
                                />
                            </div>
                        )}
                    </div>
                    <div className="mc-about-copy">
                        <SectionHeading label="Nossa essência">
                            {section.title}
                        </SectionHeading>
                        <div className="mc-prose">
                            {paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                        <CallToAction section={section} secondary />
                        <div className="mc-values">
                            <div className="mc-value-card">
                                <Route size={20} aria-hidden="true" />
                                <div>
                                    <strong>Estrada</strong>
                                    <span>Novos horizontes a cada viagem</span>
                                </div>
                            </div>
                            <div className="mc-value-card">
                                <Users size={20} aria-hidden="true" />
                                <div>
                                    <strong>Companheirismo</strong>
                                    <span>Ninguém roda sozinho</span>
                                </div>
                            </div>
                            <div className="mc-value-card">
                                <Compass size={20} aria-hidden="true" />
                                <div>
                                    <strong>Liberdade</strong>
                                    <span>A paixão sobre duas rodas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
    if (section.key === 'activities') {
        const icons = [Route, Users, Flag];
        return (
            <section id="activities" className="mc-section mc-activities">
                <div className="mc-container">
                    <div className="mc-section-top">
                        <SectionHeading label="A vida em movimento">
                            {section.title}
                        </SectionHeading>
                        <CallToAction section={section} secondary />
                    </div>
                    {section.image_url && (
                        <img
                            className="mc-activities-photo"
                            src={section.image_url}
                            alt=""
                            loading="lazy"
                            width={1200}
                            height={480}
                        />
                    )}
                    <div
                        className={`mc-activity-grid${paragraphs.length === 1 ? ' mc-activity-single' : ''}`}
                    >
                        {paragraphs.map((paragraph, index) => {
                            const Icon = icons[index % icons.length];
                            return (
                                <article key={index} className="mc-activity">
                                    <div className="mc-activity-header">
                                        <span className="mc-activity-num">
                                            0{index + 1}
                                        </span>
                                        <Icon
                                            size={26}
                                            strokeWidth={1.4}
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <p>{paragraph}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }
    if (section.key === 'instagram') {
        const instagramUrl = section.cta_url || 'https://instagram.com';
        const displayHandle = instagramUrl.includes('instagram.com/')
            ? '@' +
              (instagramUrl
                  .split('instagram.com/')[1]
                  ?.split(/[/?#]/)[0] || 'motoclube')
            : '@motoclube';

        return (
            <section
                id="instagram"
                className="mc-section mc-instagram"
                aria-labelledby="instagram-title"
            >
                <div className="mc-container">
                    <div className="mc-instagram-top">
                        <div className="mc-instagram-heading">
                            <p className="mc-eyebrow mc-eyebrow-copper">
                                <span />
                                <Instagram size={14} aria-hidden="true" />
                                Galeria & Instagram
                            </p>
                            <h2 id="instagram-title" className="mc-title">
                                {section.title}
                            </h2>
                            <div className="mc-prose mc-prose-light">
                                {paragraphs.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        <aside
                            className="mc-instagram-profile"
                            aria-label="Perfil do Instagram do Clube"
                        >
                            <div className="mc-instagram-profile-card">
                                <div className="mc-instagram-profile-header">
                                    <div className="mc-instagram-avatar">
                                        <Instagram
                                            size={28}
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="mc-instagram-meta">
                                        <span className="mc-instagram-handle">
                                            {displayHandle}
                                        </span>
                                        <span className="mc-instagram-verified">
                                            <Shield
                                                size={12}
                                                aria-hidden="true"
                                            />{' '}
                                            Perfil Oficial
                                        </span>
                                    </div>
                                </div>
                                <p className="mc-instagram-desc">
                                    Fotos dos encontros, passeios de fim de
                                    semana e a rotina do nosso motoclube sobre
                                    duas rodas.
                                </p>
                                <a
                                    className="mc-button mc-button-copper mc-instagram-follow-btn"
                                    href={instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Instagram
                                        size={18}
                                        aria-hidden="true"
                                    />
                                    {section.cta_label ||
                                        'Seguir no Instagram'}
                                    <ArrowUpRight
                                        size={16}
                                        aria-hidden="true"
                                    />
                                </a>
                            </div>
                        </aside>
                    </div>

                    {section.image_url && (
                        <div className="mc-instagram-spotlight">
                            <img
                                src={section.image_url}
                                alt="Foto em destaque do motoclube"
                                loading="lazy"
                                width={1200}
                                height={480}
                            />
                        </div>
                    )}

                    <div
                        className="mc-instagram-grid"
                        role="region"
                        aria-label="Fotos recentes do Instagram"
                    >
                        {instagramPosts.map((post) => (
                            <a
                                key={post.id}
                                className="mc-instagram-card"
                                href={instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Foto no Instagram: ${post.caption}`}
                            >
                                <div className="mc-instagram-card-media">
                                    <img
                                        src={post.image}
                                        alt={post.alt}
                                        loading="lazy"
                                        width={400}
                                        height={400}
                                    />
                                    <div className="mc-instagram-card-tag">
                                        {post.tag}
                                    </div>
                                </div>
                                <div className="mc-instagram-overlay">
                                    <div className="mc-instagram-overlay-top">
                                        <Instagram
                                            size={20}
                                            aria-hidden="true"
                                        />
                                        <ArrowUpRight
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <p className="mc-instagram-caption">
                                        {post.caption}
                                    </p>
                                    <div className="mc-instagram-stats">
                                        <span>
                                            <Heart
                                                size={14}
                                                fill="currentColor"
                                                aria-hidden="true"
                                            />
                                            {post.likes}
                                        </span>
                                        <span>
                                            <MessageCircle
                                                size={14}
                                                aria-hidden="true"
                                            />
                                            {post.comments}
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="mc-instagram-banner">
                        <div className="mc-instagram-banner-copy">
                            <h3>Rode com a gente. Registre cada quilômetro.</h3>
                            <p>
                                Compartilhe suas fotos marcando{' '}
                                <strong>#MotoclubeNaEstrada</strong> e o
                                perfil oficial para aparecer em nossos
                                destaques.
                            </p>
                        </div>
                        <a
                            className="mc-button mc-button-outline-light"
                            href={instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Ver mural completo no Instagram
                            <ArrowUpRight size={18} aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </section>
        );
    }
    return (
        <section id={section.key} className="mc-section mc-contact">
            <div className="mc-container">
                <div className="mc-contact-grid">
                    <div>
                        <SectionHeading label="Vamos conversar">
                            {section.title}
                        </SectionHeading>
                        <div className="mc-prose">
                            {paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                        <CallToAction section={section} />
                        {section.image_url && (
                            <img
                                className="mc-contact-photo"
                                src={section.image_url}
                                alt=""
                                loading="lazy"
                                width={720}
                                height={480}
                            />
                        )}
                    </div>
                    <aside className="mc-member-card">
                        <div className="mc-member-card-top">
                            <Users
                                size={26}
                                strokeWidth={1.4}
                                aria-hidden="true"
                            />
                            <span>Área exclusiva</span>
                        </div>
                        <div className="mc-member-badge-pill">
                            <Shield size={12} aria-hidden="true" />
                            <span>Integrantes Cadastrados</span>
                        </div>
                        <h3>
                            Já faz parte
                            <br />
                            do motoclube?
                        </h3>
                        <p>
                            Seu perfil, suas motos e a vida no clube em um só
                            lugar.
                        </p>
                        <Link
                            href="/login"
                            className="mc-button mc-button-light"
                        >
                            Acessar minha conta
                            <ArrowUpRight size={18} aria-hidden="true" />
                        </Link>
                        <span className="mc-member-note">
                            Use o e-mail da sua conta de membro.
                        </span>
                    </aside>
                </div>
                <div className="mc-faq">
                    <div>
                        <p className="mc-eyebrow">
                            <span />
                            Antes de seguir
                        </p>
                        <h3>Perguntas frequentes</h3>
                    </div>
                    <div className="mc-faq-items">
                        <details>
                            <summary>
                                Como acesso a área do membro?
                                <span aria-hidden="true">+</span>
                            </summary>
                            <p>
                                Selecione “Acessar minha conta” e entre com seu
                                e-mail e senha. Se ainda não tem acesso, procure
                                a administração do motoclube.
                            </p>
                        </details>
                        <details>
                            <summary>
                                Esqueci minha senha. Como recupero?
                                <span aria-hidden="true">+</span>
                            </summary>
                            <p>
                                Na tela de entrada, use a opção de recuperação
                                de senha e informe o e-mail cadastrado.{' '}
                                <Link href="/forgot-password">
                                    Recuperar minha senha{' '}
                                    <ArrowRight size={14} aria-hidden="true" />
                                </Link>
                            </p>
                        </details>
                        <details>
                            <summary>
                                Onde atualizo meus dados e minhas motos?
                                <span aria-hidden="true">+</span>
                            </summary>
                            <p>
                                Depois de entrar com uma conta vinculada ao seu
                                cadastro de membro, acesse “Meu perfil” para
                                atualizar suas informações e as motos.
                            </p>
                        </details>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function Landing({ content }: { content: Content }) {
    const { logo } = usePage().props as { logo?: string | null };
    const [menuOpen, setMenuOpen] = useState(false);
    const menuButton = useRef<HTMLButtonElement>(null);
    const sections = [...content.sections].sort(
        (a, b) => a.position - b.position,
    );
    const navigation = sections.filter((section) => section.key !== 'hero');
    const hasHero = sections.some((section) => section.key === 'hero');
    const hasAbout = sections.some((section) => section.key === 'about');
    return (
        <div className="mc-landing" lang="pt-BR" id="inicio">
            <Head title="Início">
                <meta
                    name="description"
                    content={
                        sections
                            .find((section) => section.key === 'hero')
                            ?.body.slice(0, 160) ||
                        `Conheça ${content.name}. Estrada, encontros e paixão por duas rodas.`
                    }
                />
            </Head>
            <a className="mc-skip" href="#conteudo">
                Ir para o conteúdo
            </a>
            <header
                className="mc-header"
                onKeyDown={(event) => {
                    if (event.key === 'Escape' && menuOpen) {
                        setMenuOpen(false);
                        menuButton.current?.focus();
                    }
                }}
            >
                <div className="mc-container mc-header-row">
                    <a
                        className="mc-brand"
                        href="#inicio"
                        aria-label={`${content.name}, início`}
                    >
                        {logo && (
                            <img src={logo} alt="" width={48} height={48} />
                        )}
                        <span>
                            {content.name}
                            <small>Motoclube · Estrada & irmandade</small>
                        </span>
                    </a>
                    <nav
                        className="mc-desktop-nav"
                        aria-label="Navegação principal"
                    >
                        {navigation.map((section) => (
                            <a key={section.key} href={`#${section.key}`}>
                                {sectionLabels[section.key] || section.title}
                            </a>
                        ))}
                    </nav>
                    <Link href="/login" className="mc-header-login">
                        Área do membro
                        <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                    {navigation.length > 0 && (
                        <button
                            ref={menuButton}
                            className="mc-menu-toggle"
                            type="button"
                            aria-expanded={menuOpen}
                            aria-controls="mc-mobile-nav"
                            aria-label={
                                menuOpen
                                    ? 'Fechar navegação'
                                    : 'Abrir navegação'
                            }
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    )}
                </div>
                {menuOpen && (
                    <nav
                        id="mc-mobile-nav"
                        className="mc-mobile-nav"
                        aria-label="Navegação móvel"
                    >
                        {navigation.map((section) => (
                            <a
                                key={section.key}
                                href={`#${section.key}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {sectionLabels[section.key] || section.title}
                                <ArrowDown size={16} aria-hidden="true" />
                            </a>
                        ))}
                    </nav>
                )}
            </header>
            <main id="conteudo" tabIndex={-1}>
                {!hasHero && (
                    <div className="mc-container mc-page-title">
                        <p className="mc-eyebrow">Motoclube</p>
                        <h1>{content.name}</h1>
                    </div>
                )}
                {sections.map((section) => (
                    <SectionContent
                        key={section.key}
                        section={section}
                        hasAbout={hasAbout}
                    />
                ))}
                {sections.length === 0 && (
                    <div className="mc-container mc-empty">
                        <Compass size={40} aria-hidden="true" />
                        <h2>Novas histórias estão a caminho.</h2>
                        <p>Em breve, mais sobre o nosso motoclube por aqui.</p>
                        <Link href="/login" className="mc-button">
                            Área do membro
                            <ArrowUpRight size={18} aria-hidden="true" />
                        </Link>
                    </div>
                )}
            </main>
            <footer className="mc-footer">
                <div className="mc-container">
                    <div className="mc-footer-top">
                        <div>
                            <a className="mc-brand" href="#inicio">
                                {logo && (
                                    <img
                                        src={logo}
                                        alt=""
                                        width={48}
                                        height={48}
                                    />
                                )}
                                <span>
                                    {content.name}
                                    <small>Nos encontramos no caminho.</small>
                                </span>
                            </a>
                        </div>
                        <nav aria-label="Navegação do rodapé">
                            {navigation.map((section) => (
                                <a key={section.key} href={`#${section.key}`}>
                                    {sectionLabels[section.key] ||
                                        section.title}
                                </a>
                            ))}
                            <Link href="/login">
                                Área do membro
                                <ArrowUpRight size={14} aria-hidden="true" />
                            </Link>
                        </nav>
                    </div>
                    <div className="mc-footer-bottom">
                        <p>
                            © {new Date().getFullYear()} {content.name}.
                        </p>
                        <a href="#inicio">Voltar ao início ↑</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
