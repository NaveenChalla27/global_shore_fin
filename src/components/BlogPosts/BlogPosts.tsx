import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {IconArrow} from "../Icons";
import shared from "../../styles/shared.module.css";
import styles from "./BlogPosts.module.css";
import {fetchPosts, type Post} from "../../api/countries";
import {useCountry} from "../../context/CountryContext";

const VALID_THUMBS = new Set(["thumb", "thumb2", "thumb3"]);

export default function BlogPosts() {
    const {country} = useCountry();
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const ctrl = new AbortController();
        fetchPosts(ctrl.signal, country.code)
        .then((list) => setPosts(list.slice(0, 3)))
        .catch((err) => {
            if ((err as Error).name !== "AbortError") console.warn("[BlogPosts]", err);
        });
        return () => ctrl.abort();
    }, [country.code]);

    if (posts.length === 0) return null;

    return (
        <section className={shared.sectionAlt} id="blog">
            <div className={shared.container}>
                <div className={shared.sectionHead}>
                    <span className={shared.eyebrow}>Resources</span>
                    <h2>Latest from the Blog</h2>
                    <p>Practical tax, payroll, and accounting insights for US businesses and global filers.</p>
                </div>
                <div className={styles.grid}>
                    {posts.map((p, i) => {
                        const thumbKey =
                            p.thumb && VALID_THUMBS.has(p.thumb) ? p.thumb : ["thumb", "thumb2", "thumb3"][i % 3];
                        return (
                            <article className={styles.card} key={p.slug}>
                                {p.image ? (
                                    <img
                                        src={p.image}
                                        alt={p.title}
                                        className={styles.thumbImg}
                                        loading="lazy"
                                        width={800}
                                        height={450}
                                        onError={(e) => {
                                            const img = e.currentTarget;
                                            img.style.display = "none";
                                            const fb = img.nextElementSibling as HTMLElement | null;
                                            if (fb) fb.style.display = "block";
                                        }}
                                    />
                                ) : null}
                                <div className={styles[thumbKey]} style={{display: p.image ? "none" : "block"}} />
                                <div className={styles.body}>
                                    <span className={styles.tag}>{p.tag}</span>
                                    <h4 className={styles.title}>{p.title}</h4>
                                    <p className={styles.excerpt}>{p.excerpt}</p>
                                    <Link to={`/blog/${p.slug}`} className={shared.btnGhost}>
                                        Read More <IconArrow size={14} />
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
                <div className={shared.center}>
                    <Link to="/blog" className={shared.btnSecondary}>
                        View All Posts
                    </Link>
                </div>
            </div>
        </section>
    );
}
