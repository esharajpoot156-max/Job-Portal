import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { HelpCircle, MessageSquare, Flag, Mail, Phone, Inbox, ChevronDown } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const TABS = [
    { id: "faqs", label: "FAQs", icon: HelpCircle },
    { id: "contact", label: "Contact Support", icon: MessageSquare },
    { id: "report", label: "Report a Problem", icon: Flag },
    { id: "mymessages", label: "My Messages", icon: Inbox },
];

const FAQS = {
    seeker: [
        { q: "How do I apply for a job?", a: "Open any job listing and click Apply Now. If your resume is already on file, your application is submitted instantly — otherwise you'll be asked to upload one first." },
        { q: "How do I edit or update my profile?", a: "Go to your profile page, you can edit your details directly, and it updates on all future applications." },
        { q: "Is it free to use this platform?", a: "Yes, creating an account and applying to jobs is completely free for job seekers." },
        { q: "Can I save jobs to look at later?", a: "Yes. Click the bookmark icon on any job listing to save it. Find all saved jobs under the saved jobs tab inside My Jobs." },
        { q: "How do I reset my password?", a: "Go to Settings > Account & Security while logged in. If locked out, use Forgot Password on the login page." },
        { q: "Why isn't my profile showing up to recruiters?", a: "Check Settings > Privacy and make sure Public Profile is turned on." },
    ],
    employer: [
        { q: "How do I post a new job?", a: "Go to your Employer Dashboard and click Post a Job. Fill in the role details, requirements, and salary range, then submit." },
        { q: "Why is my job posting still pending?", a: "Your job stays pending until admin approves it. Once approved, it becomes visible to job seekers." },
        { q: "How do I view and manage applicants?", a: "Open the job posting from My posted jobs and click Applicants to view, accept, or reject each one." },
        { q: "Will I be notified when someone applies?", a: "Yes. You'll get a notification each time a candidate applies to one of your job postings." },
        { q: "How do I set up or update my company profile?", a: "Go to Company Settings to update your logo, description, industry, and location." },
        { q: "Can I message a candidate before deciding?", a: "Yes. Open the applicant's profile from your applicants list and click message." },
    ],
};

const REPORT_TYPES = {
    seeker: ["Bug", "Fake Job Listing", "Inappropriate Content", "Harassment", "Other"],
    employer: ["Bug", "Fake Candidate Profile", "Inappropriate Content", "Harassment", "Other"],
};

const statusStyles = { open: "bg-amber-500/15 text-amber-500", replied: "bg-blue-500/15 text-blue-500", closed: "bg-emerald-500/15 text-emerald-500" };

const inputCls = "w-full px-4 py-2.5 rounded-xl border dark:border-gray-700 bg-white dark:bg-[#121214] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]";

const Section = ({ title, children }) => (
    <div className="bg-white dark:bg-[#1a1a1d] border dark:border-gray-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-lg dark:text-white">{title}</h3>
        {children}
    </div>
);

const Labeled = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
        {children}
    </div>
);

const FaqItem = ({ q, a, open, onToggle }) => (
    <div className="border-b dark:border-gray-800 pb-4 last:border-0 last:pb-0">
        <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 text-left">
            <span className="font-medium dark:text-white">{q}</span>
            <ChevronDown size={18} className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{a}</p>}
    </div>
);

const MyTicketCard = ({ t }) => {
    const adminReply = t.thread?.filter((m) => m.sender === "admin").slice(-1)[0]
        || (t.reply ? { message: t.reply } : null); // fallback for tickets replied before the thread system

    return (
        <div className="border-b dark:border-gray-800 pb-4 last:border-0 last:pb-0 space-y-2">
            <div className="flex items-center justify-between gap-3">
                <p className="font-medium dark:text-white">{t.kind === "contact" ? (t.subject || "Contact message") : (t.issueType || "Report")}</p>
                {t.status !== "open" && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize shrink-0 ${statusStyles[t.status]}`}>{t.status}</span>
                )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.message}</p>

            {adminReply ? (
                <div className="bg-gray-50 dark:bg-[#121214] rounded-lg p-3">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Admin reply</p>
                    <p className="text-sm dark:text-gray-200">{adminReply.message}</p>
                </div>
            ) : (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">Waiting for a reply...</p>
            )}
        </div>
    );
};

const HelpPage = () => {
    const { user } = useSelector((s) => s.auth);
    const role = user?.role === "recruiter" || user?.role === "admin" ? "employer" : "seeker";

    const [searchParams] = useSearchParams();
    const [tab, setTab] = useState(searchParams.get("tab") || "faqs");
    const [openFaq, setOpenFaq] = useState(null);
    const [sending, setSending] = useState(false);
    const [contact, setContact] = useState({ subject: "", message: "" });
    const [report, setReport] = useState({ issueType: REPORT_TYPES[role][0], description: "" });
    const [myTickets, setMyTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(false);

    useEffect(() => {
        if (tab !== "mymessages") return;
        setLoadingTickets(true);
        axiosInstance.get("/support/mine")
            .then((res) => res.data.success && setMyTickets(res.data.tickets))
            .catch(console.log)
            .finally(() => setLoadingTickets(false));
    }, [tab]);

    const submit = async (kind) => {
        const isContact = kind === "contact";
        const body = isContact ? contact : { issueType: report.issueType, description: report.description };
        if (isContact ? (!contact.subject.trim() || !contact.message.trim()) : !report.description.trim())
            return alert(isContact ? "Please fill in both subject and message" : "Please describe the problem");

        setSending(true);
        try {
            const res = await axiosInstance.post(`/support/${kind}`, body);
            if (res.data.success) {
                alert(isContact ? "Message sent — our team will get back to you soon" : "Thanks — your report has been submitted");
                isContact ? setContact({ subject: "", message: "" }) : setReport({ issueType: REPORT_TYPES[role][0], description: "" });
            }
        } catch (e) {
            alert(e.response?.data?.message || `Could not ${isContact ? "send your message" : "submit your report"}`);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#121214]">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
                <h1 className="text-2xl font-bold dark:text-white mb-6">Help & Support</h1>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible md:w-56 shrink-0 pb-2 md:pb-0">
                        {TABS.map(({ id, label, icon: Icon }) => (
                            <button key={id} onClick={() => setTab(id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${tab === id ? "bg-[#8B5CF6] text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1d]"}`}>
                                <Icon size={16} />{label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 space-y-6">
                        {tab === "faqs" && (
                            <Section title="Frequently Asked Questions">
                                {FAQS[role].map((f, i) => (
                                    <FaqItem key={f.q} {...f} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
                                ))}
                            </Section>
                        )}

                        {tab === "contact" && (
                            <>
                                <Section title="Contact Support">
                                    <Labeled label="Subject">
                                        <input className={inputCls} value={contact.subject} onChange={(e) => setContact({ ...contact, subject: e.target.value })} placeholder="What's this about?" />
                                    </Labeled>
                                    <Labeled label="Message">
                                        <textarea rows={5} className={`${inputCls} resize-none`} value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} placeholder="Tell us more about your issue..." />
                                    </Labeled>
                                    <button onClick={() => submit("contact")} disabled={sending} className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50">
                                        {sending ? "Sending..." : "Send Message"}
                                    </button>
                                </Section>
                                <Section title="Other Ways to Reach Us">
                                    <div className="flex items-center gap-3 text-sm dark:text-gray-300"><Mail size={16} className="text-[#8B5CF6]" />{role === "employer" ? "employers@jobportal.com" : "support@jobportal.com"}</div>
                                    <div className="flex items-center gap-3 text-sm dark:text-gray-300"><Phone size={16} className="text-[#8B5CF6]" />+92 300 1234567 (Mon-Fri, 9am-6pm)</div>
                                </Section>
                            </>
                        )}

                        {tab === "report" && (
                            <Section title="Report a Problem">
                                <Labeled label="Issue Type">
                                    <select value={report.issueType} onChange={(e) => setReport({ ...report, issueType: e.target.value })} className={inputCls}>
                                        {REPORT_TYPES[role].map((o) => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </Labeled>
                                <Labeled label="Description">
                                    <textarea rows={5} className={`${inputCls} resize-none`} value={report.description} onChange={(e) => setReport({ ...report, description: e.target.value })} placeholder="What happened? Include any relevant details..." />
                                </Labeled>
                                <button onClick={() => submit("report")} disabled={sending} className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50">
                                    {sending ? "Submitting..." : "Submit Report"}
                                </button>
                            </Section>
                        )}

                        {tab === "mymessages" && (
                            <Section title="My Messages">
                                {loadingTickets ? <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
                                    : myTickets.length === 0 ? <p className="text-sm text-gray-500 dark:text-gray-400">You haven't sent any messages or reports yet.</p>
                                    : myTickets.map((t) => <MyTicketCard key={t._id} t={t} />)}
                            </Section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;