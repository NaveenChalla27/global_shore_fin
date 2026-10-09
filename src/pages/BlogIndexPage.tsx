import {useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import shared from "../styles/shared.module.css";
import styles from "./BlogPage.module.css";
import {fetchPosts, type Post} from "../api/countries";

const ALL = "All";

export default function BlogIndexPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTag, setActiveTag] = useState<string>(ALL);

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "instant" as ScrollBehavior});
        document.title = "Blog & Resources — Global Shore Fin Services";
        const ctrl = new AbortController();
        fetchPosts(ctrl.signal)
        .then((list) => setPosts(list))
        .catch((err) => {
            if ((err as Error).name !== "AbortError") console.warn("[BlogIndex]", err);
        })
        .finally(() => setLoading(false));
        return () => ctrl.abort();
    }, []);

    const tags = useMemo(() => {
        const set = new Set<string>();
        posts.forEach((p) => set.add(p.tag));
        return [ALL, ...Array.from(set).sort()];
    }, [posts]);

    const filtered = useMemo(
        () => (activeTag === ALL ? posts : posts.filter((p) => p.tag === activeTag)),
        [posts, activeTag]
    );

    return (
        <>
            <section className={styles.hero}>
                <div className={shared.container}>
                    <span className={shared.eyebrow}>Resources</span>
                    <h1>Blog & Insights</h1>
                    <p>
                        Practical, plain-English guides on US tax, payroll, accounting, and business formation — written
                        for NRIs, immigrants, expats, and small business owners.
                    </p>
                </div>
            </section>

            <section className={styles.body}>
                <div className={shared.container}>
                    {tags.length > 1 && (
                        <div className={styles.filters} role="tablist" aria-label="Blog categories">
                            {tags.map((t) => (
                                <button
                                    key={t}
                                    role="tab"
                                    aria-selected={activeTag === t}
                                    className={`${styles.filter} ${activeTag === t ? styles.filterActive : ""}`}
                                    onClick={() => setActiveTag(t)}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    )}

                    {loading && <p className={styles.muted}>Loading posts…</p>}
                    {!loading && filtered.length === 0 && (
                        <p className={styles.muted}>No posts in this category yet — check back soon.</p>
                    )}

                    <div className={styles.grid}>
                        {filtered.map((p) => (
                            <Link to={`/blog/${p.slug}`} key={p.slug} className={styles.card}>
                                {p.image ? (
                                    <img
                                        src={p.image}
                                        alt={p.title}
                                        className={styles.thumb}
                                        loading="lazy"
                                        width={800}
                                        height={450}
                                    />
                                ) : (
                                    <div className={styles.thumbFallback} />
                                )}
                                <div className={styles.cardBody}>
                                    <span className={styles.tag}>{p.tag}</span>
                                    <h3 className={styles.title}>{p.title}</h3>
                                    {p.excerpt && <p className={styles.excerpt}>{p.excerpt}</p>}
                                    {p.publishedAt && (
                                        <time className={styles.date} dateTime={p.publishedAt}>
                                            {new Date(p.publishedAt).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </time>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
