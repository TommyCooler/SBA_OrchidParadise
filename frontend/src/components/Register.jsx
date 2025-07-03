import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        accountName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Validation functions
    const validateAccountName = (accountName) => {
        if (!accountName) return 'Tên tài khoản không được để trống';
        if (accountName.length < 3) return 'Tên tài khoản phải có ít nhất 3 ký tự';
        if (accountName.length > 50) return 'Tên tài khoản không được quá 50 ký tự';
        if (!/^[a-zA-Z0-9_]+$/.test(accountName)) {
            return 'Tên tài khoản chỉ được chứa chữ cái, số và dấu gạch dưới';
        }
        return null;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email không được để trống';
        if (!emailRegex.test(email)) return 'Email không đúng định dạng';
        if (email.length > 100) return 'Email không được quá 100 ký tự';
        return null;
    };

    const validatePassword = (password) => {
        if (!password) return 'Mật khẩu không được để trống';
        if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
        if (password.length > 100) return 'Mật khẩu không được quá 100 ký tự';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
        }
        return null;
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        if (!confirmPassword) return 'Vui lòng xác nhận mật khẩu';
        if (password !== confirmPassword) return 'Mật khẩu xác nhận không khớp';
        return null;
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Handle input blur (real-time validation)
    const handleInputBlur = (e) => {
        const { name, value } = e.target;
        let error = null;

        switch (name) {
            case 'accountName':
                error = validateAccountName(value.trim());
                break;
            case 'email':
                error = validateEmail(value.trim());
                break;
            case 'password':
                error = validatePassword(value);
                break;
            case 'confirmPassword':
                error = validateConfirmPassword(formData.password, value);
                break;
            default:
                break;
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        newErrors.accountName = validateAccountName(formData.accountName.trim());
        newErrors.email = validateEmail(formData.email.trim());
        newErrors.password = validatePassword(formData.password);
        newErrors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);

        setErrors(newErrors);

        // Return true if no errors
        return !Object.values(newErrors).some(error => error !== null);
    };

    // Register API call
    const registerUser = async (userData) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.error || 'Đăng ký thất bại' };
            }
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: 'Lỗi kết nối đến server' };
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin');
            return;
        }

        setLoading(true);

        const userData = {
            accountName: formData.accountName.trim(),
            email: formData.email.trim(),
            password: formData.password
        };

        const result = await registerUser(userData);

        if (result.success) {
            toast.success('Đăng ký thành công! Đang chuyển hướng...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <i className="fas fa-seedling"></i>
                    </div>
                    <h2>Đăng Ký Tài Khoản</h2>
                    <p>Tạo tài khoản mới để quản lý hoa lan</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Account Name */}
                    <div className="form-group">
                        <label htmlFor="accountName">
                            <i className="fas fa-user"></i>
                            Tên tài khoản
                        </label>
                        <input
                            type="text"
                            id="accountName"
                            name="accountName"
                            value={formData.accountName}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            placeholder="Nhập tên tài khoản"
                            className={errors.accountName ? 'error' : ''}
                            required
                        />
                        {errors.accountName && (
                            <span className="error-message">{errors.accountName}</span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">
                            <i className="fas fa-envelope"></i>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            placeholder="Nhập địa chỉ email"
                            className={errors.email ? 'error' : ''}
                            required
                        />
                        {errors.email && (
                            <span className="error-message">{errors.email}</span>
                        )}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password">
                            <i className="fas fa-lock"></i>
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            placeholder="Nhập mật khẩu"
                            className={errors.password ? 'error' : ''}
                            required
                        />
                        {errors.password && (
                            <span className="error-message">{errors.password}</span>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            <i className="fas fa-lock"></i>
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            placeholder="Nhập lại mật khẩu"
                            className={errors.confirmPassword ? 'error' : ''}
                            required
                        />
                        {errors.confirmPassword && (
                            <span className="error-message">{errors.confirmPassword}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Đang đăng ký...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-user-plus"></i>
                                Đăng Ký
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="auth-link">
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;