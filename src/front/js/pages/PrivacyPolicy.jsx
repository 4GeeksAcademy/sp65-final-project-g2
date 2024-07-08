import React from "react";
import { useEffect } from "react";

export const PrivacyPolicy = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container mt-5 text-white">
            <div className="row justify-content-center">
                <div className="col-10">
                    <h2 className="mb-4 text-center">Privacy Policy</h2>
                    <p className="text-center">
                        At <strong>ABA Fitness </strong>, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and protect your information when you visit our website <a href="https://www.example.com">www.ABAFitness.com</a> and/or use our services.
                    </p>
                    <h3 className="mt-4">1. Information We Collect</h3>
                    <p>We collect various types of information in connection with the provision of our services, including:</p>
                    <h4 className="mt-3">1.1 Information You Provide Directly</h4>
                    <ul>
                        <li><strong>Registration data:</strong> When you register on our site, we collect personal information such as your name, email address, postal address, phone number, and payment details.</li>
                        <li><strong>Contact data:</strong> When you communicate with us through contact forms, emails, or phone calls, we may retain the information you provide in these communications.</li>
                    </ul>
                    <h4 className="mt-3">1.2 Information We Collect Automatically</h4>
                    <ul>
                        <li><strong>Usage data:</strong> We collect information about how you interact with our site and services, such as pages visited, time spent on the site, and actions taken.</li>
                        <li><strong>Device data:</strong> We collect information about the devices you use to access our services, including device type, operating system, device settings, unique device identifiers, and network data.</li>
                    </ul>
                    <h4 className="mt-3">1.3 Information Collected from Third Parties</h4>
                    <ul>
                        <li><strong>Partner data:</strong> We may receive information about you from our business and marketing partners.</li>
                        <li><strong>Social media data:</strong> If you access our services through a social network or link your account with us to a social network, we may receive information from your social network profile.</li>
                    </ul>
                    <h3 className="mt-4">2. How We Use Your Information</h3>
                    <p>We use the collected information for the following purposes:</p>
                    <ul>
                        <li><strong>Providing and managing our services:</strong> To manage your account, process your transactions, and facilitate the use of our services.</li>
                        <li><strong>Improving our services:</strong> To understand how you use our services and enhance user experience.</li>
                        <li><strong>Communications:</strong> To send you updates, respond to your inquiries, and provide customer support.</li>
                        <li><strong>Marketing and advertising:</strong> To send you promotional communications and display relevant advertisements.</li>
                        <li><strong>Legal compliance:</strong> To comply with legal obligations and protect our rights and the safety of our users and services.</li>
                    </ul>
                    <h3 className="mt-4">3. How We Share Your Information</h3>
                    <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
                    <ul>
                        <li><strong>Service providers:</strong> Third parties who perform services on our behalf, such as payment processing, data analysis, and website hosting.</li>
                        <li><strong>Business partners:</strong> Third parties with whom we collaborate to offer joint services or promotions.</li>
                        <li><strong>Legal compliance:</strong> When necessary to comply with law, regulations, or legal processes, or to protect the rights and safety of us, our users, and others.</li>
                    </ul>
                    <h3 className="mt-4">4. Security of Your Information</h3>
                    <p>We implement appropriate security measures to protect your personal data against unauthorized access, loss, alteration, and disclosure. However, no transmission or storage system is completely secure, so we cannot guarantee the absolute security of your information.</p>
                    <h3 className="mt-4">5. Data Retention</h3>
                    <p>We retain your personal information for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law.</p>
                    <h3 className="mt-4">6. Your Rights and Choices</h3>
                    <p>You have certain rights regarding your personal information, including:</p>
                    <ul>
                        <li><strong>Access and correction:</strong> You can request access to the personal information we hold about you and correct any inaccuracies.</li>
                        <li><strong>Deletion:</strong> You can request that we delete your personal information, subject to certain limitations.</li>
                        <li><strong>Opt-out:</strong> You can opt out of receiving promotional communications from us.</li>
                    </ul>
                    <p>To exercise your rights, please contact us at <a href="mailto:contact@example.com">contact@abafitness.com</a>.</p>
                    <h3 className="mt-4">7. Cookies and Tracking Technologies</h3>
                    <p>We use cookies and similar technologies to enhance your experience on our website, analyze usage, and deliver personalized advertisements. You can manage your cookie preferences through your browser settings.</p>

                    <h3 className="mt-4">8. Changes to This Privacy Policy</h3>
                    <p>We may update this Privacy Policy occasionally. We will notify you of any significant changes by posting the new policy on our site and, where required by law, obtaining your consent.</p>
                    <h3 className="mt-4">9. Contact Us</h3>
                    <p>If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:</p>
                    <p>
                        <strong>ABA Fitness</strong><br />
                        <br />
                        <a href="mailto:contact@example.com">contact@abafitness.com</a><br />
                        +34 679 65 79 12
                    </p>
                </div>
            </div>
        </div>
    );
};
