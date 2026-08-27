import { useState } from "react";
import { HelpCircle, MessageSquare, Flag, BookOpen, ChevronDown, Mail, Phone } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const TABS = [
    { id: "faqs", label: "FAQs", icon: HelpCircle },
    { id: "contact", label: "Contact Support", icon: MessageSquare },
    { id: "report", label: "Report a Problem", icon: Flag },
    { id: "guides", label: "Guides", icon: BookOpen },
];

const FAQS = [
    {
        q: "How do I apply for a job?",
        a: "Open any job listing and click Apply Now. If your resume is already on file, your application is submitted instantly — otherwise you'll be asked to upload one first.",
    },
    {
        q: "How do I edit or update my resume?",
        a: "Go to your Profile page and select Resume from the left menu. You can upload a new file or edit your details directly, and it updates on all future applications.",
    },
    {
        q: "How does job matching work?",
        a: "We match jobs to your profile using your skills, experience, and preferences. The more complete your profile, the more relevant your matches will be.",
    },
    {
        q: "Can I withdraw an application after submitting it?",
        a: "Yes. Open the job from your Applications tab and select Withdraw Application. The employer will no longer see it as active.",
    },
    {
        q: "How do I reset my password?",
        a: "Go to Settings > Account & Security to change your password while logged in. If you're locked out, use the Forgot Password link on the login page instead.",
    },
    {
        q: "Why isn't my profile showing up to recruiters?",
        a: "Check Settings > Privacy and make sure Public Profile is turned on. A hidden profile won't appear in recruiter searches.",
    },
];

const GUIDES = [
    { title: "Getting started as a job seeker", desc: "Set up your profile, add a resume, and start applying in minutes." },
    { title: "Writing a resume that gets noticed", desc: "Tips on formatting, keywords, and what recruiters actually look for." },
    { title: "Understanding application statuses", desc: "What Applied, In Review, Shortlisted, and Rejected actually mean." },
    { title: "Staying safe on the job portal", desc: "How to spot fake listings and report suspicious employers." },
];

const Section = ({ title, children }) => (
    <div className="bg-white dark:bg-[#1a1a1d] border dark:border-gray-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-lg dark:text-white">{title}</h3>
        {children}
    </div>
);

const Field = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
        <input {...props} className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-700 bg-white dark:bg-[#121214] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" />
    </div>
);

const TextArea = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
        <textarea {...props} rows={5} className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-700 bg-white dark:bg-[#121214] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] resize-none" />
    </div>
);

const Select = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2.5 rounded-xl border dark:border-gray-700 bg-white dark:bg-[#121214] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
        >
            {options.map((o) => (
                <option key={o} value={o}>{o}</option>
            ))}
        </select>
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

const HelpPage = () => {
    const [tab, setTab] = useState("faqs");
    const [openFaq, setOpenFaq] = useState(null);
    const [sending, setSending] = useState(false);

    const [contact, setContact] = useState({ subject: "", message: "" });
    const [report, setReport] = useState({ issueType: "Bug", description: "" });

    const submitContact = async () => {
        if (!contact.subject.trim() || !contact.message.trim()) return alert("Please fill in both subject and message");
        setSending(true);
        try {
            const res = await axiosInstance.post("/support/contact", contact);
            if (res.data.success) {
                alert("Message sent — our team will get back to you soon");
                setContact({ subject: "", message: "" });
            }
        } catch (e) {
            alert(e.response?.data?.message || "Could not send your message");
        } finally {
            setSending(false);
        }
    };

    const submitReport = async () => {
        if (!report.description.trim()) return alert("Please describe the problem");
        setSending(true);
        try {
            const res = await axiosInstance.post("/support/report", report);
            if (res.data.success) {
                alert("Thanks — your report has been submitted");
                setReport({ issueType: "Bug", description: "" });
            }
        } catch (e) {
            alert(e.response?.data?.message || "Could not submit your report");
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
                            <button
                                key={id}
                                onClick={() => setTab(id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                                    tab === id ? "bg-[#8B5CF6] text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1d]"
                                }`}
                            >
                                <Icon size={16} />
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 space-y-6">
                        {tab === "faqs" && (
                            <Section title="Frequently Asked Questions">
                                {FAQS.map((f, i) => (
                                    <FaqItem key={f.q} q={f.q} a={f.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
                                ))}
                            </Section>
                        )}

                        {tab === "contact" && (
                            <>
                                <Section title="Contact Support">
                                    <Field label="Subject" type="text" value={contact.subject} onChange={(e) => setContact({ ...contact, subject: e.target.value })} placeholder="What's this about?" />
                                    <TextArea label="Message" value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} placeholder="Tell us more about your issue..." />
                                    <button onClick={submitContact} disabled={sending} className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50">
                                        {sending ? "Sending..." : "Send Message"}
                                    </button>
                                </Section>

                                <Section title="Other Ways to Reach Us">
                                    <div className="flex items-center gap-3 text-sm dark:text-gray-300">
                                        <Mail size={16} className="text-[#8B5CF6]" />
                                        support@jobportal.com
                                    </div>
                                    <div className="flex items-center gap-3 text-sm dark:text-gray-300">
                                        <Phone size={16} className="text-[#8B5CF6]" />
                                        +92 300 1234567 (Mon–Fri, 9am–6pm)
                                    </div>
                                </Section>
                            </>
                        )}

                        {tab === "report" && (
                            <Section title="Report a Problem">
                                <Select
                                    label="Issue Type"
                                    value={report.issueType}
                                    onChange={(e) => setReport({ ...report, issueType: e.target.value })}
                                    options={["Bug", "Fake Job Listing", "Inappropriate Content", "Harassment", "Other"]}
                                />
                                <TextArea label="Description" value={report.description} onChange={(e) => setReport({ ...report, description: e.target.value })} placeholder="What happened? Include any relevant details..." />
                                <button onClick={submitReport} disabled={sending} className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50">
                                    {sending ? "Submitting..." : "Submit Report"}
                                </button>
                            </Section>
                        )}

                        {tab === "guides" && (
                            <Section title="Guides & Resources">
                                {GUIDES.map((g) => (
                                    <div key={g.title} className="flex items-center justify-between gap-4 border-b dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium dark:text-white">{g.title}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{g.desc}</p>
                                        </div>
                                        <button className="text-sm text-[#8B5CF6] font-medium shrink-0">Read</button>
                                    </div>
                                ))}
                            </Section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;