import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter, } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-secondary p-4 text-gray-100">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <p className="mb-2">Contact Information:</p>
            <div className="flex items-center mb-1">
              <FaPhone className="mr-2" />
              <span>+1 (123) 456-7890</span>
            </div>
            <div className="flex items-center mb-1">
              <FaEnvelope className="mr-2" />
              <span>info@theartisans.com</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <span>123 Wall Street, New York, USA</span>
            </div>
          </div>
          <div>
            <p className="mb-2">Connect with Us:</p>
            <div className="flex">
              <a href="https://www.facebook.com/example" target="_blank" className="mr-2">
                <FaFacebook />
              </a>
              <a href="https://www.twitter.com/example" target="_blank" className="mr-2">
                <FaXTwitter />
              </a>
              <a href="https://www.instagram.com/example" target="_blank" className="mr-2">
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com/company/example" target="_blank">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
        <p className="text-center mt-4">© 2024 The Artisans. All rights reserved.</p>
      </div>
    </footer>
  );
}
