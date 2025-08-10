"use client";

import { useState } from "react";

export default function PasswordField({ label = "كلمة المرور", name = "password", register, errors }) {
    const [show, setShow] = useState(false);
    return (
        <div className="mb-3 position-relative">
            <label className="form-label">{label}</label>
            <input className="form-control" type={show ? "text" : "password"} {...register(name)} />
            <span className="position-absolute top-50 start-0 translate-middle-y p-0 mt-3">
                <i
                    className={`cursor-pointer p-2 fas ${show ? "fa-eye" : "fa-eye-slash"}`}
                    onClick={() => setShow((v) => !v)}
                />
            </span>
            {errors?.[name] && <small className="text-danger">{errors[name].message}</small>}
        </div>
    );
}
