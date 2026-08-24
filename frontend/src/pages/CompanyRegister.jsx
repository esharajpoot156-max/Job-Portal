import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, Globe, MapPin, Users, Calendar } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const inputClass = "w-full border p-2 rounded pl-9 text-gray-600 dark:text-gray-300 dark:bg-[#1a1a1d] dark:border-gray-700";
const plainInputClass = "w-full border p-2 rounded text-gray-600 dark:text-gray-300 dark:bg-[#1a1a1d] dark:border-gray-700";
const labelClass = "text-sm text-gray-500 dark:text-gray-400";

const Field = ({ label, name, icon: Icon, required, value, onChange, ...props }) => (
    <div>
        <label className={labelClass}>{label}{required && " *"}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />}
            <input
                name={name}
                required={required}
                value={value}
                onChange={onChange}
                className={Icon ? inputClass : plainInputClass}
                {...props}
            />
        </div>
    </div>
);

const CompanyRegister = () => {
    const [input, setInput] = useState({
        companyName: "",
        email: "",
        website: "",
        location: "",
        industry: "",
        companySize: "",
        foundedYear: "",
        description: ""
    });
    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [companyId, setCompanyId] = useState(null);
    const navigate = useNavigate();

    // Check if the user already has a registered company, and pre-fill if so
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await axiosInstance.get("/company/get");
                if (res.data.success && res.data.companies?.length > 0) {
                    const company = res.data.companies[0];
                    setCompanyId(company._id);
                    setInput({
                        companyName: company.name || "",
                        email: company.email || "",
                        website: company.website || "",
                        location: company.location || "",
                        industry: company.industry || "",
                        companySize: company.companySize || "",
                        foundedYear: company.foundedYear || "",
                        description: company.description || ""
                    });
                }
            } catch (error) {
                console.log(error);
            } finally {
                setFetching(false);
            }
        };
        fetchCompany();
    }, []);

    const changeHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });
    const logoHandler = (e) => setLogo(e.target.files[0]);
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(input).forEach(([k, v]) => formData.append(k, v));
        if (logo) formData.append("file", logo);

        try {
            setLoading(true);
            if (companyId) {
                // save changes
                const res = await axiosInstance.put(`/company/update/${companyId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                if (res.data.success) {
                    alert(res.data.message);
                }
            } else {
                // Register
                const res = await axiosInstance.post("/company/register", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                if (res.data.success) {
                    alert(res.data.message);
                    setCompanyId(res.data.company._id);
                    navigate("/admin/jobs/post");
                }
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="p-8 max-w-2xl mx-auto min-h-screen bg-white dark:bg-[#121214] dark:text-white">
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <h1 className="text-2xl font-bold mb-6">{companyId ? "Company Profile" : "Register Your Company"}</h1>

            <form onSubmit={submitHandler} className="space-y-4">
                <Field label="Company Name" name="companyName" icon={Building2} required value={input.companyName} onChange={changeHandler} />
                <Field label="Company Email" name="email" type="email" icon={Mail} required value={input.email} onChange={changeHandler} />
                <Field label="Website" name="website" icon={Globe} placeholder="https://example.com" value={input.website} onChange={changeHandler} />
                <Field label="Location" name="location" icon={MapPin} required value={input.location} onChange={changeHandler} />
                <Field label="Industry" name="industry" placeholder="e.g. IT, Finance, Healthcare" required value={input.industry} onChange={changeHandler} />
                <Field label="Company Size" name="companySize" icon={Users} placeholder="e.g. 11-50 employees" value={input.companySize} onChange={changeHandler} />
                <Field label="Founded Year" name="foundedYear" icon={Calendar} placeholder="e.g. 2015" value={input.foundedYear} onChange={changeHandler} />

                <div>
                    <label className={labelClass}>Company Description *</label>
                    <textarea
                        name="description"
                        value={input.description}
                        onChange={changeHandler}
                        rows={4}
                        required
                        placeholder="Tell job seekers about your company..."
                        className={plainInputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>Company Logo</label>
                    <div className="flex items-center gap-3 border rounded p-2 dark:border-gray-700">
                        <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded text-sm">
                            Choose File
                            <input type="file" accept=".png,.jpg,.jpeg" onChange={logoHandler} className="hidden" />
                        </label>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{logo ? logo.name : "No file chosen"}</span>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full sm:w-auto sm:px-10 sm:mx-auto sm:block bg-[#8B5CF6] text-white py-2 rounded">
                    {loading ? (companyId ? "Saving..." : "Registering...") : (companyId ? "Save Changes" : "Register Company")}
                </button>

                <button type="button" onClick={() => navigate(-1)} className="w-full sm:w-auto sm:px-10 sm:mx-auto sm:block text-sm text-gray-500 dark:text-gray-400 py-2">
                    ← Back
                </button>
            </form>
        </div>
    );
};

export default CompanyRegister;
