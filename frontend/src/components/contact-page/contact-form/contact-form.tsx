'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { getCurrentUser } from '@/services';
import styles from './contact-form.module.css';

function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    content: '',
  });
  const [error, setError] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (user) {
        setFormData({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || '',
          content: '',
        });
      }
    })();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError([]);

    if (!formData.fullName || !formData.email || !formData.phone) {
      setError((prev) => [...prev, 'Vui lòng điều đầy đủ thông tin!']);

      if (!formData.content) {
        setError((prev) => [...prev, 'Vui lòng nhập nội dung!']);
      }
      return;
    }

    alert(
      'Yêu cầu của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.',
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        defaultValue={formData.fullName}
        name="fullName"
        type="text"
        placeholder="Họ và tên"
        className={styles.input}
        onChange={handleChange}
      />
      <input
        defaultValue={formData.phone}
        name="phone"
        type="tel"
        placeholder="Số điện thoại"
        className={styles.input}
        onChange={handleChange}
      />
      <input
        defaultValue={formData.email}
        name="email"
        type="email"
        placeholder="Email"
        className={styles.input}
        onChange={handleChange}
      />
      <textarea
        defaultValue={formData.content}
        placeholder="Nội dung"
        className={styles.textarea}
        onChange={handleChange}
      />

      {error.length > 0 && (
        <ul className={styles.error}>
          {error.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}

      <button className={styles.button}>Gửi</button>
    </form>
  );
}

export default ContactForm;
