import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MapPin,
  Shield,
  Users,
  Lock,
  FileText,
  Phone,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-32 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Privacy Policy
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              Effective Date: August 14, 2025
            </Badge>
            <span>Alchemist Ai </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Introduction */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              This Privacy Policy describes how Alchemist Ai Labs Inc. collects,
              uses, and protects the personal information of users of Alchemist
              Ai. By using Alchemist Ai, you consent to the collection and use
              of your data as outlined here.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Account Information
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Name, email, billing information
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Payment Details
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Processed securely through TagMango Inc (outside India) or
                  TagMango Pvt Ltd (India)
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Usage Data
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Tokens used, prompts submitted, AI responses generated
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Technical Data
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  IP address, browser type, device information
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                "Provide, personalize, and maintain services",
                "Process subscription payments",
                "Improve Alchemist Ai features and offerings",
                "Communicate important updates and offers (where permitted)",
                "Ensure platform safety and compliance",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700 dark:text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Data Sharing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">
              We may share limited data with:
            </p>
            <div className="space-y-3">
              {[
                "Payment processors (TagMango Inc / TagMango Pvt Ltd) for transaction fulfillment",
                "Third-party AI providers to generate responses to your requests",
                "Service providers helping us maintain the platform",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700 dark:text-slate-300">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-medium">
                We do not sell your personal data.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Security & Retention */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">
                We implement encryption, access controls, and secure data
                storage. However, no system is 100% secure.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">
                We retain personal and usage data only as long as necessary to
                provide services or comply with legal obligations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Your Rights */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-700 dark:text-slate-300">
              Depending on your jurisdiction, you may have the right to access,
              correct, delete, or limit your data. Contact us at{" "}
              <span className="font-mono text-blue-600 dark:text-blue-400">
                Goldmoonpharma@gmail.com
              </span>{" "}
              to exercise these rights.
            </p>

            <Separator />

            {/* GDPR */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                European Economic Area (EEA) - GDPR
              </h4>
              <div className="space-y-2">
                {[
                  "Access, correct, update, or request deletion of your personal information",
                  "Object to the processing of your personal data and request data portability",
                  "Withdraw consent at any time (where processing is based on consent)",
                  "Lodge a complaint with your local Data Protection Authority",
                ].map((right, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {right}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* CCPA */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                California Residents - CCPA
              </h4>
              <div className="space-y-2">
                {[
                  "Request disclosure of the categories and specific pieces of personal information we have collected",
                  "Request deletion of your personal information, subject to certain legal exceptions",
                  "Opt-out of the sale of your personal information (note: Alchemist Ai does not sell personal data)",
                  "Be free from discrimination for exercising your privacy rights",
                ].map((right, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2.5 flex-shrink-0"></div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {right}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Sections */}
        <div className="grid gap-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Age & Parental Consent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {[
                  "Alchemist Ai is not directed towards children under the minimum digital consent age in their country (13 in the US; 16 in the EU unless lowered by law)",
                  "By using this platform, you confirm that you meet the legal minimum age in your jurisdiction or have obtained verifiable parental consent",
                  "We do not knowingly collect personal data from children under these ages without consent. If we discover that such data has been provided, we will delete it promptly",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Third-Party Content and Links</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">
                AI responses may contain third-party information. We are not
                responsible for the accuracy or legality of third-party outputs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Changes to Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">
                We may update this policy from time to time. Continued use of AI
                Alchemist Ai after updates means you accept the revised policy.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              For questions, support, or legal notices, contact:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  Goldmoonpharma@gmail.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  +1 631-624-8967
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-blue-600 mt-1" />
                <span className="text-slate-700 dark:text-slate-300">
                  1525 N Thompson Dr, Bayshore, NY 11706
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2025 Alchemist Ai Labs Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
