import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MapPin,
  FileText,
  Coins,
  CreditCard,
  Shield,
  Users,
  AlertTriangle,
  Scale,
  Phone,
} from "lucide-react";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen pt-32 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Terms & Conditions
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            >
              Effective Date: August 14, 2025
            </Badge>
            <span>Alchemist AI </span>
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
          <CardContent className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Welcome to Alchemist AI ("the Platform"). Alchemist AI is owned
              and operated as a brand of Alchemist Ai Labs Inc., a company
              registered in the State of Delaware, USA ("we," "our," or "us").
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              By accessing or using Alchemist AI via chat.alchemistai.com or any
              of our related services, you ("User," "you") agree to be bound by
              these Terms & Conditions, our Privacy Policy, and any additional
              policies we may introduce.
            </p>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                If you do not agree, you must discontinue use immediately.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Services Provided */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Services Provided
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">
              Alchemist AI provides access to premium artificial intelligence
              services, including but not limited to interactions with AI
              platforms such as:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Grok",
                "ChatGPT",
                "Gemini",
                "DeepSeek",
                "Claude",
                "Perplexity",
              ].map((service, index) => (
                <div
                  key={index}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {service}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-3 mt-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                AI-Powered Tools:
              </h4>
              <div className="space-y-2">
                {[
                  "Prompt Enhancement",
                  "Image Generation (limited models based on availability)",
                  "Audio Transcription",
                ].map((tool, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-slate-700 dark:text-slate-300">{tool}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>
                  Your subscription includes 400,000 tokens monthly
                </strong>
                , renewable each billing cycle. Unused tokens may not roll over
                unless specifically stated.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription & Payment */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Subscription Plans & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-800 dark:text-green-200">
                      Monthly
                    </span>
                    <span className="text-green-800 dark:text-green-200">
                      USD $12 / INR ₹999
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-800 dark:text-blue-200">
                      Yearly
                    </span>
                    <span className="text-blue-800 dark:text-blue-200">
                      USD $120 / INR ₹9,999
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Prices are inclusive of applicable taxes. We reserve the right
                to change subscription prices with prior notice.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm">
                    <strong>Outside India:</strong> TagMango Inc.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm">
                    <strong>India:</strong> TagMango Private Limited
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your billing information must be accurate and up-to-date. Failed
                payments may result in account suspension.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Refund Policy */}
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertTriangle className="h-5 w-5" />
              Refund & Cancellation Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="font-semibold text-red-800 dark:text-red-200 mb-2">
                Non-Refundable Policy
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">
                All payments made to Alchemist AI are non-refundable, regardless
                of your usage during the subscription period.
              </p>
            </div>
            <div className="space-y-2">
              {[
                "Once your subscription fee is charged, you will not be entitled to a refund for any unused services, unused tokens, or partial subscription periods",
                "You may cancel your subscription at any time; however, cancellation will only prevent future billing charges",
                "Exceptions to this policy may only be granted if required by applicable law",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Token Usage Policy */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Token Usage Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Definition */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Definition of Tokens
              </h4>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  In the context of Alchemist AI, a "token" refers to a unit of
                  text-processing capacity used to interact with AI models.
                  Tokens are consumed when you send prompts and when the AI
                  generates responses. The number of tokens depends on the
                  length and complexity of the prompt and output.
                </p>
              </div>
            </div>

            <Separator />

            {/* Monthly Allocation */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Monthly Token Allocation
              </h4>
              <div className="grid gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>400,000 tokens per month</strong> included with each
                    active subscription
                  </p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-amber-800 dark:text-amber-200 text-sm">
                    Token counts reset at the start of each billing cycle.{" "}
                    <strong>Unused tokens do not roll over.</strong>
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Important Notes */}
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                  No Cash Value
                </h5>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Tokens have no monetary value, cannot be refunded, exchanged,
                  transferred, or converted into currency.
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
                  Excess Token Usage
                </h5>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Once your monthly tokens are exhausted, services may be
                  limited or require an upgrade. Alchemist AI is not liable for
                  service interruption due to token depletion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property & Restrictions */}
        <div className="grid gap-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">
                All materials, brand assets, Alchemist AI's name, logo, and
                proprietary prompt library are the intellectual property of
                Alchemist Ai Labs Inc. You may not reproduce, redistribute, or
                sell our materials without express written consent.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Restrictions on Use</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                You may not:
              </p>
              <div className="space-y-2">
                {[
                  "Use Alchemist AI for activities that break any law or regulation",
                  "Attempt to reverse-engineer, scrape, or modify the platform's backend",
                  "Share your account credentials or resell access without authorization",
                  "Generate or disseminate harmful, illegal, or discriminatory content",
                ].map((restriction, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {restriction}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acceptable Use Policy */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Acceptable Use Policy (AUP)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">
              When using Alchemist AI, you agree NOT to:
            </p>

            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Prohibited Activities:
                </h5>
                <div className="space-y-2">
                  {[
                    "Use the service in violation of any applicable law or regulation",
                    "Generate illegal, harmful, abusive, hateful, or discriminatory content",
                    "Create or share misinformation intended to deceive or cause harm",
                    "Infringe intellectual property, privacy, or publicity rights",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Technical Restrictions:
                </h5>
                <div className="space-y-2">
                  {[
                    "Attempt to bypass platform usage limits or manipulate token allocations",
                    "Reverse-engineer, decompile, or interfere with platform operations",
                    "Share, resell, or lease your account access without permission",
                    "Use Alchemist AI to develop competing AI services",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 font-medium">
                Violations may result in suspension or permanent termination of
                your account without refund.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Content Ownership */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Content Ownership & Usage Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">
                Ownership of Output
              </h5>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Subject to third-party AI provider terms, you retain rights to
                content you lawfully create using Alchemist AI, including for
                commercial purposes.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-medium text-slate-900 dark:text-slate-100">
                Important Considerations:
              </h5>
              <div className="space-y-2">
                {[
                  "Your use of Outputs is subject to each AI provider's terms of service",
                  "We make no warranties that Output is free from copyright or IP claims",
                  "You are solely responsible for ensuring Outputs don't infringe third-party rights",
                  "You may not use Outputs to violate laws or create harmful content",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                Limited License to Alchemist AI
              </h5>
              <p className="text-slate-700 dark:text-slate-300 text-sm">
                You grant us a non-exclusive, royalty-free, worldwide license to
                store, process, and use your prompts and Outputs solely for
                providing and improving our services. We do not claim ownership
                of your Outputs.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Legal Sections */}
        <div className="grid gap-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Disclaimer of Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">
                Alchemist AI integrates AI technologies from third-party
                providers (OpenAI, Anthropic, Google, Perplexity AI, etc.). We
                do not claim ownership over their outputs, and their respective
                terms & policies also apply to your use of certain features.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">
                We provide the platform on an "as is" basis without warranties
                of any kind. To the extent permitted by law, Alchemist Ai Labs
                Inc. will not be liable for any damages (direct, indirect,
                incidental, or consequential) resulting from the use or
                inability to use our services.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Age & Parental Consent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {[
                  "Alchemist AI is not directed towards children under the minimum digital consent age (13 in US; 16 in EU unless lowered by law)",
                  "By using this platform, you confirm you meet the legal minimum age or have verifiable parental consent",
                  "We do not knowingly collect data from children under these ages without consent",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Termination & Governing Law */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">
                We reserve the right to suspend or terminate accounts that
                violate these Terms. No refunds will be given for terminations
                due to violations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Governing Law & Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">
                These Terms are governed by the laws of Delaware, USA. Any
                disputes will be resolved through binding arbitration, except
                where prohibited by law.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
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
            © 2025 Alchemist Ai Labs Inc. All rights reserved. Alchemist AI is a
            trademark of Alchemist Ai Labs Inc.
          </p>
        </div>
      </div>
    </div>
  );
}
