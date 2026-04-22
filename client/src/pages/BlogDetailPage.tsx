import {useEffect, useMemo, useState} from "react";
import {Link, useParams} from "react-router-dom";
import shared from "../styles/shared.module.css";
import styles from "./BlogPage.module.css";
import {fetchPosts, type Post} from "../api/countries";
import {useBooking} from "../context/BookingContext";

export default function BlogDetailPage() {
    const {slug = ""} = useParams();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const {open} = useBooking();

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "instant" as ScrollBehavior});
        const ctrl = new AbortController();
        fetchPosts(ctrl.signal)
        .then(setPosts)
        .catch((err) => {
            if ((err as Error).name !== "AbortError") console.warn("[BlogDetail]", err);
        })
        .finally(() => setLoading(false));
        return () => ctrl.abort();
    }, []);

    const post = useMemo(() => posts.find((p) => p.slug === slug), [posts, slug]);
    const related = useMemo(
        () => (post ? posts.filter((p) => p.slug !== post.slug && p.tag === post.tag).slice(0, 3) : []),
        [posts, post]
    );

    useEffect(() => {
        if (post) document.title = `${post.title} — Global Shore Fin Services`;
    }, [post]);

    if (loading) {
        return (
            <section className={styles.body}>
                <div className={shared.container}>
                    <p className={styles.muted}>Loading…</p>
                </div>
            </section>
        );
    }

    if (!post) {
        return (
            <section className={styles.body}>
                <div className={shared.container}>
                    <h1>Post not found</h1>
                    <p>
                        <Link to="/blog">← Back to all posts</Link>
                    </p>
                </div>
            </section>
        );
    }

    const paragraphs = (post.body ?? "").split(/\n+/).filter(Boolean);

    return (
        <>
            <section className={styles.detailHero}>
                <div className={shared.container}>
                    <div className={styles.crumbs}>
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/blog">Blog</Link>
                        <span>/</span>
                        <span>{post.tag}</span>
                    </div>
                    <span className={styles.tagSolid}>{post.tag}</span>
                    <h1>{post.title}</h1>
                    {post.publishedAt && (
                        <time className={styles.dateLight} dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </time>
                    )}
                </div>
            </section>

            <section className={styles.body}>
                <div className={`${shared.container} ${styles.detailLayout}`}>
                    <article className={styles.article}>
                        {post.image && (
                            <img
                                src={post.image}
                                alt={post.title}
                                className={styles.featured}
                                width={1200}
                                height={675}
                            />
                        )}

                        {post.excerpt && <p className={styles.lead}>{post.excerpt}</p>}

                        {paragraphs.length > 0 ? (
                            paragraphs.map((para, i) => <p key={i}>{para}</p>)
                        ) : (
                            <p className={styles.muted}>Full article coming soon.</p>
                        )}

                        <div className={styles.cta}>
                            <h3>Need help with {post.tag.toLowerCase()}?</h3>
                            <p>Book a free 30-minute consultation with our experts today.</p>
                            <button
                                type="button"
                                className={shared.btnPrimary}
                                onClick={() => open({source: `blog:${post.slug}`})}
                            >
                                Book a Free Consultation
                            </button>
                        </div>
                    </article>

                    {related.length > 0 && (
                        <aside className={styles.related}>
                            <h3>Related posts</h3>
                            <ul>
                                {related.map((r) => (
                                    <li key={r.slug}>
                                        <Link to={`/blog/${r.slug}`}>{r.title}</Link>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/blog" className={shared.btnGhost}>
                                ← All posts
                            </Link>
                        </aside>
                    )}
                </div>
            </section>
        </>
    );
}
