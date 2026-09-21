import { useEffect, useState } from "react";

/* ------------------------------------------------------------------
   DESIGN 2 — navy + saffron on white.  Same content, same images and
   same form logic as SchoolOfLaw.jsx, so the /public/law folder from
   law-images.zip works for both.  Search for "VERIFY" to find copy that
   must be checked against sol.sandipuniversity.edu.in.
------------------------------------------------------------------- */

const CONFIG = {
    phone: "+91-XXXXXXXXXX", // REPLACE
    phoneHref: "tel:+91XXXXXXXXXX", // REPLACE
    session: "2026–27", // VERIFY
    // POST endpoint that receives the lead as JSON (CRM, Zapier, Google
    // Apps Script, your own API). Leave empty to only log to the console.
    leadEndpoint: "",
    // Google Ads conversion, e.g. "AW-1234567890/AbCdEfGhIj"
    googleAdsSendTo: "",
};

const IMG = {
    hero: "/hero.jpg",
    about: "/about.jpg",
    baLlb: "/ba-llb.jpg",
    bbaLlb: "/bba-llb.jpg",
    llm: "/llm.jpg",
    moot1: "/moot-1.jpg",
    moot2: "/moot-2.jpg",
    moot3: "/moot-3.jpg",
    moot4: "/moot-4.jpg",
    faculty: "/faculty.jpg",
    students: "/students.jpg",
    session1: "/session-1.jpg",
    session2: "/session-2.jpg",
};

const PROGRAMMES = [
    {
        name: "BA LL.B.",
        level: "Integrated · 5 years", // VERIFY
        img: IMG.baLlb,
        alt: "Academic building on the Sandip University campus with a lawn in front",
        blurb:
            "An integrated degree that pairs arts and social science subjects with core legal study. Suited to litigation, the judiciary, civil services and public policy.", // VERIFY
        eligibility: "10+2 from a recognised board", // VERIFY
    },
    {
        name: "BBA LL.B.",
        level: "Integrated · 5 years", // VERIFY
        img: IMG.bbaLlb,
        alt: "Sandip University academic block seen through flowering trees",
        blurb:
            "Business management studied alongside law. Suited to corporate practice, compliance, contracts and commercial advisory work.", // VERIFY
        eligibility: "10+2 from a recognised board", // VERIFY
    },
    {
        name: "LL.M. (Business Law)", // VERIFY exact name
        level: "Postgraduate", // VERIFY duration
        img: IMG.llm,
        alt: "School of Law building with the hills of Nashik in the background",
        blurb:
            "Advanced study of business and commercial law for graduates moving into corporate counsel roles, consultancy, research or teaching.", // VERIFY
        eligibility: "LL.B. from a recognised university", // VERIFY
    },
];

const STATS = [
    { big: "BCI", small: "Approved by the Bar Council of India" },
    { big: "Moot court", small: "Purpose-built hall on campus" },
    { big: "3", small: "Law programmes to choose from" },
    { big: "Nashik", small: "Campus on Trimbak Road" },
];

const WHY = [
    {
        title: "Approved by the Bar Council of India",
        text: "The School of Law is approved by the Bar Council of India, the regulator of legal education in the country.",
    },
    {
        title: "A moot court hall of its own",
        text: "Bench, bar, witness box and public gallery. Students argue in a proper courtroom, not a converted classroom.",
    },
    {
        title: "Faculty who mentor",
        text: "Teachers guide students through research, drafting and advocacy, and stay involved from the first year to the last.", // VERIFY
    },
    {
        title: "Law in the community",
        text: "Faculty-led awareness sessions on subjects such as cyber safety and online gaming put classroom law to public use.", // VERIFY
    },
    {
        title: "Practice built into the syllabus",
        text: "Mock trials, client counselling and drafting exercises sit inside the curriculum, alongside the statute books.", // VERIFY
    },
    {
        title: "A campus made for study",
        text: "Spacious academic blocks, open lawns and the Nashik hills as a backdrop, away from city noise.",
    },
];

const STEPS = [
    { t: "Enquire", d: "Send the form or call the admissions desk." },
    { t: "Counselling", d: "A counsellor calls to explain programmes, eligibility and fees." }, // VERIFY
    { t: "Apply", d: "Submit your application and academic documents." },
    { t: "Confirm your seat", d: "Complete the formalities and begin your law degree." },
];

const FAQS = [
    {
        q: "Is the School of Law approved by the Bar Council of India?",
        a: "Yes. The School of Law displays Bar Council of India approval on its entrance signage. Ask our counsellor for the approval details for your chosen programme.", // VERIFY
    },
    {
        q: "Who can apply for BA LL.B. and BBA LL.B.?",
        a: "Students who have completed 10+2 from a recognised board. Minimum marks and any entrance requirement are confirmed by the admissions team.", // VERIFY
    },
    {
        q: "Who can apply for the LL.M.?",
        a: "Graduates holding an LL.B. degree from a recognised university. Our counsellor will confirm the current criteria.", // VERIFY
    },
    {
        q: "What are the fees, and is a scholarship available?",
        a: "Fees differ by programme. A counsellor will share the current fee structure and any scholarship options when they call you.", // VERIFY
    },
    {
        q: "Can I visit the campus and the moot court hall?",
        a: "Yes. Request a callback and the admissions team will arrange a campus visit at a time that suits you.",
    },
];

const TRACKING_KEYS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

function readTracking() {
    if (typeof window === "undefined") return {};
    const q = new URLSearchParams(window.location.search);
    const out = {};
    TRACKING_KEYS.forEach((k) => {
        if (q.get(k)) out[k] = q.get(k);
    });
    return out;
}

function goToForm() {
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ------------------------------ form ------------------------------ */

function EnquiryForm({ idPrefix, programme, setProgramme, id }) {
    const [data, setData] = useState({ name: "", phone: "", email: "", city: "" });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const payload = {
            ...data,
            programme,
            page: typeof window !== "undefined" ? window.location.href : "",
            submittedAt: new Date().toISOString(),
            ...readTracking(),
        };
        try {
            if (CONFIG.leadEndpoint) {
                const res = await fetch(CONFIG.leadEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("Request failed");
            } else {
                console.log("Lead (no leadEndpoint set):", payload);
            }
            if (typeof window !== "undefined" && typeof window.gtag === "function" && CONFIG.googleAdsSendTo) {
                window.gtag("event", "conversion", { send_to: CONFIG.googleAdsSendTo });
            }
            setSent(true);
        } catch (err) {
            setError("Something went wrong. Please try again or call us on " + CONFIG.phone + ".");
        } finally {
            setBusy(false);
        }
    };

    if (sent) {
        return (
            <div className="form done" id={id}>
                <div className="tick" aria-hidden="true">✓</div>
                <h3>Thank you, {data.name.split(" ")[0] || "and welcome"}.</h3>
                <p className="sub">
                    An admissions counsellor will call you on {data.phone} shortly to discuss the{" "}
                    {programme || "law programmes"} at the School of Law.
                </p>
            </div>
        );
    }

    return (
        <form className="form" id={id} onSubmit={handleSubmit}>
            <h3>Request a callback</h3>
            <p className="sub">Admissions {CONFIG.session}. A counsellor will call you within one working day.</p>

            <div className="field">
                <label htmlFor={idPrefix + "-name"}>Full name</label>
                <input id={idPrefix + "-name"} name="name" autoComplete="name" required value={data.name} onChange={onChange} />
            </div>

            <div className="row">
                <div className="field">
                    <label htmlFor={idPrefix + "-phone"}>Mobile number</label>
                    <input
                        id={idPrefix + "-phone"}
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        pattern="[0-9+ \-]{10,15}"
                        title="Enter a 10 to 15 digit mobile number"
                        value={data.phone}
                        onChange={onChange}
                    />
                </div>
                <div className="field">
                    <label htmlFor={idPrefix + "-city"}>City</label>
                    <input id={idPrefix + "-city"} name="city" autoComplete="address-level2" value={data.city} onChange={onChange} />
                </div>
            </div>

            <div className="field">
                <label htmlFor={idPrefix + "-email"}>Email</label>
                <input id={idPrefix + "-email"} name="email" type="email" autoComplete="email" required value={data.email} onChange={onChange} />
            </div>

            <div className="field">
                <label htmlFor={idPrefix + "-prog"}>Programme of interest</label>
                <select id={idPrefix + "-prog"} required value={programme} onChange={(e) => setProgramme(e.target.value)}>
                    <option value="">Select a programme</option>
                    {PROGRAMMES.map((p) => (
                        <option key={p.name} value={p.name}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p className="err" role="alert">{error}</p>}

            <button type="submit" disabled={busy}>
                {busy ? "Sending…" : "Request a callback"}
            </button>
            <p className="fine">
                By submitting, you agree to be contacted by Sandip University about admissions by call, SMS or email.
            </p>
        </form>
    );
}

/* ------------------------------ page ------------------------------ */

export default function SchoolOfLaw2() {
    const [programme, setProgramme] = useState("");
    const [openFaq, setOpenFaq] = useState(0);

    useEffect(() => {
        document.title = "School of Law, Sandip University Nashik | BA LL.B., BBA LL.B., LL.M. Admissions";
    }, []);

    const choose = (name) => {
        setProgramme(name);
        goToForm();
    };

    return (
        <div className="law2">
            <Styles />

            <header className="bar">
                <div className="wrap bar-in">
                    <div className="brand">
                        <span className="b1">Sandip University</span>
                        <span className="b2">School of Law</span>
                    </div>
                    <div className="bar-right">
                        <a className="bar-phone" href={CONFIG.phoneHref}>
                            {CONFIG.phone}
                        </a>
                        <button className="btn btn-sun small" onClick={goToForm}>
                            Apply now
                        </button>
                    </div>
                </div>
            </header>

            <section className="hero">
                <div className="wrap hero-in">
                    <div className="hero-copy">
                        <span className="badge">
                            <i /> Admissions open {CONFIG.session}
                        </span>
                        <h1>
                            Learn law by arguing it,{" "}
                            <mark>in a courtroom built for students.</mark>
                        </h1>
                        <p className="lede">
                            BCI-approved integrated and postgraduate law programmes at Sandip University, Nashik, taught
                            through mock trials, moot courts and faculty who mentor you at every stage.
                        </p>
                        <ul className="ticks">
                            <li>Approved by the Bar Council of India</li>
                            <li>Dedicated moot court hall</li>
                            <li>BA LL.B., BBA LL.B. and LL.M.</li>
                            <li>Campus on Trimbak Road, Nashik</li>
                        </ul>
                        <a className="btn btn-outline" href={CONFIG.phoneHref}>
                            Call {CONFIG.phone}
                        </a>
                    </div>
                    <EnquiryForm id="enquire" idPrefix="top" programme={programme} setProgramme={setProgramme} />
                </div>

                <div className="wrap">
                    <figure className="hero-photo">
                        <img
                            src={IMG.hero}
                            alt="Law students conducting a mock trial in the moot court hall while classmates watch from the gallery"
                        />
                    </figure>
                    <div className="stats">
                        {STATS.map((s) => (
                            <div key={s.big}>
                                <b>{s.big}</b>
                                <span>{s.small}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="about">
                <div className="wrap about-grid">
                    <div>
                        <p className="kicker">About the school</p>
                        <h2>A law school that trains you to stand up and argue.</h2>
                        <p>
                            The School of Law at Sandip University prepares students for practice at the Bar, for corporate
                            legal teams, for the judiciary and for public service. The school is approved by the Bar Council
                            of India and sits on the university's campus on Trimbak Road, Nashik.
                        </p>
                        <p>
                            Teaching moves between the classroom and the courtroom. Students read the law, then draft it,
                            argue it and defend it in front of faculty and peers.
                        </p>
                        <button className="btn btn-navy" onClick={goToForm}>
                            Talk to a counsellor
                        </button>
                    </div>
                    <figure className="offset">
                        <img
                            src={IMG.about}
                            alt="Faculty and students of the School of Law standing together in front of the school's entrance"
                            loading="lazy"
                        />
                    </figure>
                </div>
            </section>

            <section className="progs">
                <div className="wrap">
                    <div className="head">
                        <p className="kicker">Programmes</p>
                        <h2>Choose your route into the legal profession</h2>
                    </div>
                    <div className="prog-list">
                        {PROGRAMMES.map((p) => (
                            <article className="prog" key={p.name}>
                                <img src={p.img} alt={p.alt} loading="lazy" />
                                <div className="prog-body">
                                    <span className="chip">{p.level}</span>
                                    <h3>{p.name}</h3>
                                    <p>{p.blurb}</p>
                                    <p className="elig">
                                        <b>Eligibility:</b> {p.eligibility}
                                    </p>
                                </div>
                                <div className="prog-cta">
                                    <button className="btn btn-sun" onClick={() => choose(p.name)}>
                                        Enquire now
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="moot">
                <div className="wrap">
                    <div className="head">
                        <p className="kicker">The moot court hall</p>
                        <h2>A real courtroom is part of the curriculum.</h2>
                        <p>
                            The school has its own moot court hall, with a bench, counsel tables, a witness box and a public
                            gallery. Students argue mock trials and appeals here, and practise the craft of advocacy long
                            before their first day in court.
                        </p>
                    </div>
                    <div className="moot-grid">
                        <figure className="m1">
                            <img src={IMG.moot1} alt="Moot court hall seen from the gallery, with the bench and counsel tables in front" loading="lazy" />
                            <figcaption>The bench and counsel tables, seen from the gallery</figcaption>
                        </figure>
                        <figure className="m4">
                            <img src={IMG.moot4} alt="Students arguing a mock trial in the moot court" loading="lazy" />
                            <figcaption>A mock trial in progress</figcaption>
                        </figure>
                        <figure className="m3">
                            <img src={IMG.moot3} alt="Angled view of the moot court bench, witness box and counsel tables" loading="lazy" />
                            <figcaption>Bench, counsel tables and witness box</figcaption>
                        </figure>
                        <figure className="m2">
                            <img src={IMG.moot2} alt="Moot court hall with counsel tables and public gallery seating" loading="lazy" />
                            <figcaption>Counsel tables and public gallery</figcaption>
                        </figure>
                    </div>
                </div>
            </section>

            <section className="why">
                <div className="wrap">
                    <div className="head light">
                        <p className="kicker">Why the School of Law</p>
                        <h2>Six reasons students choose Sandip</h2>
                    </div>
                    <ol className="why-grid">
                        {WHY.map((w, i) => (
                            <li key={w.title}>
                                <span className="num">{i + 1}</span>
                                <h3>{w.title}</h3>
                                <p>{w.text}</p>
                            </li>
                        ))}
                    </ol>
                    <div className="why-cta">
                        <button className="btn btn-sun" onClick={goToForm}>
                            Request a callback
                        </button>
                    </div>
                </div>
            </section>

            <section className="faculty">
                <div className="wrap fac-grid">
                    <figure className="offset">
                        <img
                            src={IMG.faculty}
                            alt="Faculty members of the School of Law standing in a row beside the school's signboard and the Constitution of India wall display"
                            loading="lazy"
                        />
                    </figure>
                    <div>
                        <p className="kicker">Faculty</p>
                        <h2>Teachers who stay in the room with you.</h2>
                        <p>
                            The School of Law's faculty teach, mentor and judge your mock trials. Small studio-style
                            sessions mean questions get answered, drafts get marked properly, and arguments get challenged.
                        </p>
                        <button className="btn btn-navy" onClick={goToForm}>
                            Speak to admissions
                        </button>
                    </div>
                </div>
            </section>

            <section className="life">
                <div className="wrap">
                    <div className="head">
                        <p className="kicker">Life at the school</p>
                        <h2>Sessions, seminars and a community of future lawyers</h2>
                    </div>
                    <div className="life-grid">
                        <figure>
                            <img src={IMG.students} alt="Group photograph of law students in formal black and white in front of the School of Law building" loading="lazy" />
                        </figure>
                        <figure className="l2">
                            <img src={IMG.session1} alt="Faculty addressing seated law students in a classroom, with a chalkboard behind them" loading="lazy" />
                        </figure>
                        <figure className="l3">
                            <img src={IMG.session2} alt="Faculty speaking to law students across a table, with cyber safety posters on the wall" loading="lazy" />
                        </figure>
                    </div>
                </div>
            </section>

            <section className="steps">
                <div className="wrap">
                    <div className="head">
                        <p className="kicker">Admissions {CONFIG.session}</p>
                        <h2>Four steps to your seat</h2>
                    </div>
                    <ol className="step-list">
                        {STEPS.map((s, i) => (
                            <li key={s.t}>
                                <span className="sn">{i + 1}</span>
                                <h3>{s.t}</h3>
                                <p>{s.d}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="faq">
                <div className="wrap faq-grid">
                    <div className="head">
                        <p className="kicker">Questions</p>
                        <h2>Before you apply</h2>
                        <p>Still unsure? Request a callback and a counsellor will answer everything.</p>
                    </div>
                    <div className="faq-list">
                        {FAQS.map((f, i) => (
                            <div className="faq-item" key={f.q}>
                                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>
                                    <span>{f.q}</span>
                                    <em aria-hidden="true">{openFaq === i ? "−" : "+"}</em>
                                </button>
                                {openFaq === i && <p>{f.a}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="final">
                <div className="wrap final-grid">
                    <div>
                        <p className="kicker dark">Apply now</p>
                        <h2>Your first day in court can start here.</h2>
                        <p>
                            Seats in each programme are limited. Leave your details and an admissions counsellor will call you
                            with the eligibility, fee and campus-visit details.
                        </p>
                        <a className="btn btn-navy" href={CONFIG.phoneHref}>
                            Or call {CONFIG.phone}
                        </a>
                    </div>
                    <EnquiryForm id="enquire-bottom" idPrefix="bottom" programme={programme} setProgramme={setProgramme} />
                </div>
            </section>

            <footer>
                <div className="wrap foot">
                    <div>
                        <div className="f1">Sandip University</div>
                        <div className="f2">School of Law</div>
                        <p>
                            At Post Mahiravani, Trimbak Road,
                            <br />
                            Tal. &amp; Dist. Nashik – 422213, Maharashtra
                        </p>
                    </div>
                    <div>
                        <a href={CONFIG.phoneHref}>{CONFIG.phone}</a>
                        <p className="legal">
                            © {new Date().getFullYear()} Sandip University. Programme details, eligibility and fees are
                            subject to change; confirm with the admissions office.
                        </p>
                    </div>
                </div>
            </footer>

            <div className="mbar">
                <a className="btn btn-outline-dark" href={CONFIG.phoneHref}>
                    Call now
                </a>
                <button className="btn btn-sun" onClick={goToForm}>
                    Apply now
                </button>
            </div>
        </div>
    );
}

/* ------------------------------ styles ------------------------------ */

function Styles() {
    return (
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

      .law2{
        --navy:#0E2747; --navy-2:#081A32; --sun:#F2921D; --sun-d:#D97A06; --sun-l:#FFE9CC;
        --sky:#EAF1FA; --white:#fff; --ink:#14213A; --muted:#4B5870; --line:#D6DFEB;
        background:#fff; color:var(--ink);
        font-family:'DM Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
        font-size:17px; line-height:1.6; -webkit-font-smoothing:antialiased;
      }
      .law2 *{box-sizing:border-box;}
      .law2 img{display:block;max-width:100%;}
      .law2 h1,.law2 h2,.law2 h3{font-family:'DM Serif Display',Georgia,serif;font-weight:400;margin:0;line-height:1.14;}
      .law2 p{margin:0;}
      .law2 ol,.law2 ul{margin:0;padding:0;list-style:none;}
      .law2 figure{margin:0;}
      .law2 .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 28px;}
      @media(max-width:640px){.law2 .wrap{padding:0 18px;}}
      .law2 section{padding:92px 0;}
      @media(max-width:640px){.law2 section{padding:60px 0;}}
      .law2 :focus-visible{outline:3px solid var(--sun);outline-offset:2px;}

      .law2 .kicker{display:inline-block;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--navy);background:var(--sun-l);padding:5px 12px;border-radius:99px;margin-bottom:16px;}
      .law2 .kicker.dark{background:rgba(8,26,50,.12);}
      .law2 .head{max-width:700px;margin-bottom:46px;}
      .law2 .head h2{font-size:clamp(1.9rem,3.8vw,2.8rem);color:var(--navy);}
      .law2 .head p:not(.kicker){margin-top:16px;color:var(--muted);font-size:18px;}
      .law2 .head.light h2{color:#fff;}
      .law2 .head.light .kicker{background:rgba(255,255,255,.14);color:#fff;}

      .law2 .btn{display:inline-flex;align-items:center;justify-content:center;border:2px solid transparent;border-radius:10px;padding:14px 24px;font:700 15.5px/1.2 'DM Sans',sans-serif;text-decoration:none;cursor:pointer;transition:background .15s,color .15s,border-color .15s,transform .15s;}
      .law2 .btn:active{transform:translateY(1px);}
      .law2 .btn.small{padding:10px 18px;font-size:14.5px;}
      .law2 .btn-sun{background:var(--sun);color:var(--navy-2);}
      .law2 .btn-sun:hover{background:#FFA53B;}
      .law2 .btn-navy{background:var(--navy);color:#fff;margin-top:26px;}
      .law2 .btn-navy:hover{background:var(--navy-2);}
      .law2 .btn-outline{border-color:var(--navy);color:var(--navy);background:transparent;margin-top:28px;}
      .law2 .btn-outline:hover{background:var(--navy);color:#fff;}
      .law2 .btn-outline-dark{border-color:var(--navy);color:var(--navy);background:#fff;}

      /* top bar */
      .law2 .bar{position:sticky;top:0;z-index:50;background:var(--navy);color:#fff;}
      .law2 .bar-in{display:flex;align-items:center;justify-content:space-between;gap:16px;height:68px;}
      .law2 .brand{display:flex;flex-direction:column;line-height:1.1;}
      .law2 .b1{font-size:11.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--sun);}
      .law2 .b2{font-family:'DM Serif Display',serif;font-size:23px;}
      .law2 .bar-right{display:flex;align-items:center;gap:18px;}
      .law2 .bar-phone{font-weight:700;text-decoration:none;color:#fff;}
      @media(max-width:560px){.law2 .bar-phone{display:none;}}

      /* hero */
      .law2 .hero{padding:56px 0 0;background:linear-gradient(180deg,var(--sky) 0%,#fff 100%);}
      .law2 .hero-in{display:grid;grid-template-columns:1fr;gap:40px;align-items:start;}
      @media(min-width:980px){.law2 .hero-in{grid-template-columns:1.15fr .85fr;gap:64px;padding-top:12px;}}
      .law2 .badge{display:inline-flex;align-items:center;gap:9px;font-size:13.5px;font-weight:700;color:var(--navy);padding:7px 14px;border-radius:99px;background:#fff;border:1px solid var(--line);}
      .law2 .badge i{width:8px;height:8px;border-radius:50%;background:var(--sun);display:inline-block;}
      .law2 .hero h1{font-size:clamp(2.3rem,5vw,3.8rem);color:var(--navy);margin:22px 0 0;}
      .law2 .hero mark{background:linear-gradient(transparent 62%,rgba(242,146,29,.5) 62%);color:inherit;padding:0 2px;}
      .law2 .lede{margin-top:20px;max-width:34em;font-size:19px;color:var(--muted);}
      .law2 .ticks{margin-top:24px;display:grid;grid-template-columns:1fr;gap:10px 26px;font-weight:600;color:var(--navy);}
      @media(min-width:600px){.law2 .ticks{grid-template-columns:1fr 1fr;}}
      .law2 .ticks li{position:relative;padding-left:30px;}
      .law2 .ticks li::before{content:"✓";position:absolute;left:0;top:1px;width:21px;height:21px;border-radius:50%;background:var(--sun);color:var(--navy-2);font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;}
      .law2 .hero-photo{margin-top:56px;border-radius:22px;overflow:hidden;box-shadow:0 24px 60px rgba(14,39,71,.22);}
      .law2 .hero-photo img{width:100%;height:clamp(240px,36vw,460px);object-fit:cover;object-position:30% 45%;}
      .law2 .stats{position:relative;z-index:2;display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:-42px 16px 0;}
      @media(min-width:820px){.law2 .stats{grid-template-columns:repeat(4,1fr);gap:16px;margin:-48px 40px 0;}}
      .law2 .stats div{background:#fff;border-radius:14px;padding:18px 20px;box-shadow:0 10px 30px rgba(14,39,71,.16);border-bottom:4px solid var(--sun);}
      .law2 .stats b{display:block;font-family:'DM Serif Display',serif;font-weight:400;font-size:24px;color:var(--navy);}
      .law2 .stats span{display:block;font-size:14px;color:var(--muted);line-height:1.4;margin-top:2px;}

      /* form */
      .law2 .form{background:#fff;color:var(--ink);border-radius:18px;padding:30px;box-shadow:0 24px 60px rgba(14,39,71,.22);border:1px solid var(--line);border-top:6px solid var(--sun);scroll-margin-top:100px;}
      .law2 .form h3{font-size:27px;color:var(--navy);}
      .law2 .form .sub{margin:8px 0 20px;font-size:15px;color:var(--muted);line-height:1.5;}
      .law2 .field{margin-bottom:14px;}
      .law2 .row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
      @media(max-width:440px){.law2 .row{grid-template-columns:1fr;gap:0;}}
      .law2 .form label{display:block;font-size:13.5px;font-weight:700;margin-bottom:5px;color:var(--navy);}
      .law2 .form input,.law2 .form select{width:100%;min-height:48px;font:inherit;font-size:16px;color:var(--ink);background:#fff;border:1.5px solid #B7C4D6;border-radius:10px;padding:10px 12px;}
      .law2 .form input:focus,.law2 .form select:focus{outline:3px solid rgba(242,146,29,.4);border-color:var(--sun-d);}
      .law2 .form button[type=submit]{width:100%;margin-top:6px;min-height:52px;border:0;border-radius:10px;background:var(--sun);color:var(--navy-2);font:700 16.5px 'DM Sans',sans-serif;cursor:pointer;}
      .law2 .form button[type=submit]:hover{background:#FFA53B;}
      .law2 .form button[disabled]{opacity:.7;cursor:progress;}
      .law2 .form .fine{margin-top:12px;font-size:12.5px;color:var(--muted);line-height:1.5;}
      .law2 .form .err{margin:0 0 12px;padding:10px 12px;background:#FDECEC;color:#8A1C1C;border-radius:8px;font-size:14.5px;}
      .law2 .form.done{text-align:center;padding:44px 30px;}
      .law2 .tick{width:58px;height:58px;margin:0 auto 16px;border-radius:50%;background:var(--sun);color:var(--navy-2);font-size:26px;font-weight:800;display:flex;align-items:center;justify-content:center;}

      /* about + faculty (shared offset image) */
      .law2 .about-grid,.law2 .fac-grid{display:grid;gap:48px;align-items:center;}
      @media(min-width:900px){.law2 .about-grid{grid-template-columns:.95fr 1.05fr;gap:72px;}.law2 .fac-grid{grid-template-columns:1.1fr .9fr;gap:72px;}}
      .law2 .offset img{width:100%;height:auto;border-radius:16px;}
      .law2 .about .offset{margin:0 14px 14px 0;}
      .law2 .about .offset img{box-shadow:14px 14px 0 var(--sun);}
      .law2 .faculty .offset{margin:0 14px 14px 0;}
      .law2 .faculty .offset img{box-shadow:14px 14px 0 var(--navy);}
      .law2 .about h2,.law2 .faculty h2{font-size:clamp(1.8rem,3.4vw,2.6rem);color:var(--navy);margin-bottom:18px;}
      .law2 .about p:not(.kicker),.law2 .faculty p:not(.kicker){color:var(--muted);font-size:18px;margin-bottom:14px;}
      .law2 .faculty{background:var(--sky);}

      /* programmes */
      .law2 .progs{background:#fff;padding-top:24px;}
      .law2 .prog-list{display:grid;gap:22px;}
      .law2 .prog{display:grid;grid-template-columns:1fr;background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:0 6px 22px rgba(14,39,71,.07);}
      .law2 .prog img{width:100%;height:220px;object-fit:cover;}
      .law2 .prog-body{padding:24px 26px 6px;}
      .law2 .prog-cta{padding:0 26px 26px;}
      @media(min-width:900px){
        .law2 .prog{grid-template-columns:300px 1fr auto;align-items:stretch;}
        .law2 .prog img{height:100%;min-height:220px;}
        .law2 .prog-body{padding:28px 8px 28px 30px;}
        .law2 .prog-cta{padding:28px 30px 28px 0;display:flex;align-items:center;}
      }
      .law2 .chip{display:inline-block;font-size:12.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--navy);background:var(--sun-l);border-radius:99px;padding:4px 12px;}
      .law2 .prog h3{font-size:28px;color:var(--navy);margin:12px 0 8px;}
      .law2 .prog p{color:var(--muted);font-size:16.5px;max-width:46em;}
      .law2 .prog .elig{margin-top:10px;font-size:15px;color:var(--ink);}

      /* moot */
      .law2 .moot{background:var(--sky);}
      .law2 .moot-grid{display:grid;grid-template-columns:1fr;gap:16px;}
      @media(min-width:820px){.law2 .moot-grid{grid-template-columns:repeat(3,1fr);grid-auto-rows:300px;}
        .law2 .m1{grid-column:span 2;}.law2 .m2{grid-column:span 2;}}
      .law2 .moot-grid figure{position:relative;overflow:hidden;border-radius:18px;min-height:230px;background:var(--navy);}
      .law2 .moot-grid img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease;}
      .law2 .moot-grid figure:hover img{transform:scale(1.03);}
      .law2 .moot-grid figcaption{position:absolute;left:14px;bottom:14px;max-width:calc(100% - 28px);background:#fff;color:var(--navy);font-size:14px;font-weight:700;padding:7px 14px;border-radius:99px;box-shadow:0 4px 14px rgba(0,0,0,.2);}

      /* why */
      .law2 .why{background:var(--navy);color:#fff;}
      .law2 .why-grid{display:grid;gap:18px;}
      @media(min-width:700px){.law2 .why-grid{grid-template-columns:repeat(2,1fr);}}
      @media(min-width:1000px){.law2 .why-grid{grid-template-columns:repeat(3,1fr);}}
      .law2 .why-grid li{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:26px;}
      .law2 .num{display:flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:50%;background:var(--sun);color:var(--navy-2);font-weight:800;margin-bottom:16px;}
      .law2 .why-grid h3{font-size:22px;margin-bottom:8px;}
      .law2 .why-grid p{color:#C5D0E2;font-size:16.5px;}
      .law2 .why-cta{margin-top:40px;text-align:center;}

      /* life */
      .law2 .life-grid{display:grid;gap:16px;}
      @media(min-width:820px){.law2 .life-grid{grid-template-columns:1.5fr 1fr 1fr;height:340px;}}
      .law2 .life-grid figure{overflow:hidden;border-radius:18px;min-height:220px;}
      .law2 .life-grid img{width:100%;height:100%;object-fit:cover;}
      .law2 .l2 img{object-position:50% 55%;}
      .law2 .l3 img{object-position:35% 45%;}

      /* steps */
      .law2 .steps{background:var(--sky);}
      .law2 .step-list{display:grid;gap:34px;}
      @media(min-width:760px){.law2 .step-list{grid-template-columns:repeat(4,1fr);gap:28px;}}
      .law2 .step-list li{position:relative;}
      .law2 .sn{display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;background:var(--navy);color:#fff;font-family:'DM Serif Display',serif;font-size:22px;margin-bottom:16px;position:relative;z-index:1;}
      @media(min-width:760px){.law2 .step-list li:not(:last-child)::after{content:"";position:absolute;top:23px;left:58px;right:-14px;height:2px;background:repeating-linear-gradient(90deg,var(--sun) 0 8px,transparent 8px 14px);}}
      .law2 .step-list h3{font-size:22px;color:var(--navy);margin-bottom:6px;}
      .law2 .step-list p{color:var(--muted);font-size:16.5px;}

      /* faq */
      .law2 .faq-grid{display:grid;gap:36px;}
      @media(min-width:900px){.law2 .faq-grid{grid-template-columns:.8fr 1.2fr;gap:72px;}.law2 .faq-grid .head{position:sticky;top:100px;align-self:start;margin-bottom:0;}}
      .law2 .faq-item{border:1px solid var(--line);border-radius:14px;margin-bottom:12px;background:#fff;}
      .law2 .faq-item button{width:100%;display:flex;justify-content:space-between;align-items:center;gap:18px;text-align:left;background:none;border:0;padding:20px 22px;font:700 18px/1.35 'DM Sans',sans-serif;color:var(--navy);cursor:pointer;}
      .law2 .faq-item em{font-style:normal;font-size:26px;color:var(--sun-d);flex:none;}
      .law2 .faq-item p{padding:0 22px 22px;color:var(--muted);font-size:17px;}

      /* final */
      .law2 .final{background:var(--sun);color:var(--navy-2);}
      .law2 .final-grid{display:grid;gap:44px;align-items:center;}
      @media(min-width:900px){.law2 .final-grid{grid-template-columns:1fr .85fr;gap:72px;}}
      .law2 .final h2{font-size:clamp(2rem,4vw,3rem);margin-bottom:18px;}
      .law2 .final p:not(.kicker):not(.sub):not(.fine):not(.err){font-size:19px;margin-bottom:8px;max-width:30em;}
      .law2 .final .form{border-top-color:var(--navy);box-shadow:0 24px 60px rgba(8,26,50,.3);}

      /* footer */
      .law2 footer{background:var(--navy-2);color:#A9B7CC;padding:50px 0 42px;font-size:15px;}
      .law2 .foot{display:grid;gap:28px;}
      @media(min-width:760px){.law2 .foot{grid-template-columns:1fr 1fr;}}
      .law2 .f1{font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--sun);font-weight:700;}
      .law2 .f2{font-family:'DM Serif Display',serif;font-size:26px;color:#fff;margin-bottom:10px;}
      .law2 footer a{color:#fff;font-weight:700;text-decoration:none;font-size:19px;}
      .law2 .legal{margin-top:12px;font-size:13px;line-height:1.55;}

      /* mobile bar */
      .law2 .mbar{display:none;}
      @media(max-width:760px){
        .law2 .mbar{display:grid;grid-template-columns:1fr 1fr;gap:10px;position:fixed;left:0;right:0;bottom:0;z-index:60;padding:10px 14px;background:#fff;border-top:1px solid var(--line);box-shadow:0 -6px 20px rgba(14,39,71,.1);}
        .law2 .mbar .btn{padding:13px 10px;}
        .law2 footer{padding-bottom:98px;}
      }
      @media(prefers-reduced-motion:reduce){.law2 *{transition:none!important;}}
    `}</style>
    );
}