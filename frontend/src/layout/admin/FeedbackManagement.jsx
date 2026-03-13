// quan ly frontend : quan ly feedback
// Đây là trang "cha" mà admin sẽ truy cập. Nó dùng RequireAdmin để bảo vệ chính nó, sau đó hiển thị FeedbackTable bên trong.

import RequireAdmin from "./RequireAdmin";
import { FeedbackTable } from "./components/FeedbackTable";
import React, { useState } from "react";
import FeedbackModel from "../../model/FeedbackModel";

const FeedbackManagement = () => {
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    const handleReload = () => {
        setReloadKey(prev => prev + 1);
    };

    return (
        <div className='container my-4'>
            <div className='d-flex align-items-center justify-content-between mb-3'>
                <h3>Quản lý Feedback</h3>
                <div className='d-flex gap-2'>
                    <input
                        className='form-control'
                        placeholder='Tìm theo tiêu đề hoặc người dùng...'
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        style={{ width: 300 }}
                    />
                </div>
            </div>

            <FeedbackTable
                searchKeyword={searchKeyword}
                reloadKey={reloadKey}
                onFeedbackSelected={setSelectedFeedback}
                onReload={handleReload}
            />
        </div>
    );
};

const FeedbackPage = RequireAdmin(FeedbackManagement);
export default FeedbackPage;
