import React from "react";
import { useEffect } from "react";

export const ConditionsTerms = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container mt-5 text-white">
            <div className="row justify-content-center">
                <div className="col-10">
                    <h2 className="mb-4 text-center">Terms and Conditions</h2>
                    <p className="text-center">
                        Welcome to <strong>ABA Fitness</strong> ("we", "our", or "us"). By accessing or using our services, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully before using our services.
                    </p>
                    <h3 className="mt-4">1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using any part of our website or services, you agree to be bound by these Terms and Conditions, including any additional policies available on the website. If you do not agree to all the terms and conditions, you may not access the website or use the services.
                    </p>
                    <h3 className="mt-4">2. Modifications to Terms</h3>
                    <p>
                        We reserve the right to modify or update these Terms and Conditions at any time. The modifications will be effective once published on this page. It is your responsibility to periodically review the updated terms. Your continued use of our services after any changes constitutes your acceptance of the new terms.
                    </p>
                    <h3 className="mt-4">3. Use of Our Services</h3>
                    <h4 className="mt-3">3.1 Age Requirements</h4>
                    <p>
                        You must be at least 18 years old to use our services or have permission from your parents or legal guardians if you are under 18 but over 13 years old. By using our services, you warrant that you meet this age requirement.
                    </p>
                    <h4 className="mt-3">3.2 User Account</h4>
                    <p>
                        To access certain features of our services, you may need to create an account. You are responsible for maintaining the confidentiality of your account and password, and you agree to immediately notify us of any unauthorized use of your account. We reserve the right to suspend or terminate your account at any time for any reason.
                    </p>
                    <h4 className="mt-3">3.3 Prohibited Activities</h4>
                    <p>You must not:</p>
                    <ul>
                        <li>Use our services for any illegal or unauthorized purpose.</li>
                        <li>Violate any law in your jurisdiction (including but not limited to copyright laws).</li>
                        <li>Upload or transmit any malicious code, viruses, or any type of harmful software.</li>
                        <li>Attempt to collect personal information from other users without their consent.</li>
                        <li>Impersonate any person or entity.</li>
                    </ul>
                    <h3 className="mt-4">4. Intellectual Property</h3>
                    <p>
                        All content, including text, graphics, logos, images, and software, is the property of <strong>[Company/Application/Website Name]</strong> or its content suppliers and is protected by copyright laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written permission.
                    </p>
                    <h3 className="mt-4">5. Limitation of Liability</h3>
                    <p>
                        To the maximum extent permitted by applicable law, <strong>[Company/Application/Website Name]</strong> shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or any other intangible losses resulting from:
                    </p>
                    <ul>
                        <li>Your use or inability to use our services.</li>
                        <li>Any content obtained from the services.</li>
                        <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
                    </ul>
                    <h3 className="mt-4">6. Termination</h3>
                    <p>
                        We may suspend or terminate your access to our services at any time, without prior notice or liability, for any reason, including if you violate these Terms and Conditions. All provisions of these terms which by their nature should survive termination shall survive, including, without limitation, ownership provisions, warranty disclaimers, and limitations of liability.
                    </p>
                    <h3 className="mt-4">7. Applicable Law</h3>
                    <p>
                        These Terms and Conditions shall be governed and construed in accordance with the laws of [Country/State], without regard to its conflict of law provisions. Any dispute arising out of or in connection with these terms shall be resolved in the courts of [Country/State].
                    </p>
                    <h3 className="mt-4">8. Contact</h3>
                    <p>
                        If you have any questions or concerns about these Terms and Conditions, please contact us at:
                    </p>
                    <p>
                        <strong>ABA Fitness</strong><br />
                        [Address]<br />
                        <a href="mailto:contact@example.com">contact@abafitness.com</a><br />
                        +34 679 657 912
                    </p>
                </div>
            </div>
        </div>
    );
};