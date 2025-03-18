import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export const unstable_settings = {
  headerShown: false,
};

const TermsAndConditions: React.FC = () => {
  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4">Terms and Conditions</Text>

      <Text className="text-lg font-semibold mb-2">1. Introduction</Text>
      <Text className="text-base text-gray-600 mb-4">
        Welcome to CzeSamPol. By accessing or using our app, you agree to comply with and be bound by the following terms and conditions. Please review these terms carefully. If you do not agree with these terms, you should not use this app.
      </Text>

      <Text className="text-lg font-semibold mb-2">2. Intellectual Property Rights</Text>
      <Text className="text-base text-gray-600 mb-4">
        Unless otherwise stated, CzeSamPol owns the intellectual property rights for all material on this app. All intellectual property rights are reserved. You may access this from [Your App Name] for personal use only, subject to restrictions set in these terms.
      </Text>

      <Text className="text-lg font-semibold mb-2">3. User Responsibilities</Text>
      <Text className="text-base text-gray-600 mb-4">
        - You must use the app in compliance with all applicable laws and regulations.{"\n"}
        - You are not allowed to use the app in any way that may harm the app, or other users.{"\n"}
        - You must provide accurate information when creating an account and are responsible for maintaining the confidentiality of your account.
      </Text>

      <Text className="text-lg font-semibold mb-2">4. Restrictions</Text>
      <Text className="text-base text-gray-600 mb-4">
        You are specifically restricted from all of the following:{"\n"}
        - Publishing any material from this app in any other media.{"\n"}
        - Selling, sublicensing, or otherwise commercializing any app material.{"\n"}
        - Using this app in any way that is damaging to the app.{"\n"}
        - Engaging in any data mining, data harvesting, or any other similar activity.
      </Text>

      <Text className="text-lg font-semibold mb-2">5. Limitation of Liability</Text>
      <Text className="text-base text-gray-600 mb-4">
        In no event shall CzeSamPol, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this app, whether such liability is under contract, tort, or otherwise. [Your Company Name] shall not be liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this app.
      </Text>

      <Text className="text-lg font-semibold mb-2">6. Privacy Policy</Text>
      <Text className="text-base text-gray-600 mb-4">
        Your privacy is important to us. Our Privacy Policy outlines how we handle your personal information. By using this app, you consent to the collection and use of your information as outlined in our Privacy Policy.
      </Text>

      <Text className="text-lg font-semibold mb-2">7. Modifications to Terms</Text>
      <Text className="text-base text-gray-600 mb-4">
      CzeSamPol reserves the right to revise these terms at any time as it sees fit, and by using this app, you are expected to review these terms regularly.
      </Text>

      <Text className="text-lg font-semibold mb-2">8. Governing Law</Text>
      <Text className="text-base text-gray-600 mb-4">
      These terms and conditions shall be governed by and construed in accordance with the laws of CzeSamPol, and you submit to the non-exclusive jurisdiction of the state and federal courts located in the courthouse to resolve any disputes.
      </Text>

      <Text className="text-lg font-semibold mb-2">9. Contact Information</Text>
      <Text className="text-base text-gray-600 mb-4">
        If you have any questions about these Terms, please contact us at:{"\n"}
        - Email: support@czesampol.com{"\n"}
        - Address: CzeSamPol, Łódź aleje Politechniki 1
      </Text>
    </ScrollView>
  );
};

export default TermsAndConditions;
