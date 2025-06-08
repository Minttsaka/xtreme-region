"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, Star, Zap, MessageCircle, FileText, Crown, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Live Conversations",
      price: "30,000",
      period: "per month",
      description: "Perfect for interactive AI conversations and real-time learning",
      features: [
        "Unlimited AI conversations",
        "Real-time voice interaction",
        "Advanced AI responses",
        "Priority support",
        "Mobile & desktop access",
        "24/7 availability",
      ],
      icon: MessageCircle,
      color: "blue",
      popular: false,
    },
    {
      name: "Transcriptions",
      price: "15,000",
      period: "per month",
      description: "Ideal for converting audio content to text with high accuracy",
      features: [
        "Unlimited transcriptions",
        "High accuracy AI transcription",
        "Multiple audio formats",
        "Fast processing",
        "Download & export options",
        "Batch processing",
      ],
      icon: FileText,
      color: "green",
      popular: false,
    },
    {
      name: "Complete Package",
      price: "40,000",
      originalPrice: "45,000",
      period: "per month",
      description: "Best value! Get both live conversations and transcriptions",
      features: [
        "Everything in Live Conversations",
        "Everything in Transcriptions",
        "Priority processing",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated support",
        "Early access to new features",
        "API access",
      ],
      icon: Crown,
      color: "purple",
      popular: true,
      savings: "Save 5,000 MWK",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="mb-4">
            <Star className="w-4 h-4 mr-2" />
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock the power of AI with our flexible pricing options. All prices in Malawi Kwacha (MWK).
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon
            return (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular
                    ? "border-2 border-purple-500 shadow-xl ring-4 ring-purple-100"
                    : "border border-gray-200 hover:border-gray-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-semibold">
                    🎉 Most Popular Choice
                  </div>
                )}

                <CardHeader className={`text-center ${plan.popular ? "pt-12" : "pt-6"}`}>
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      plan.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : plan.color === "green"
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    <IconComponent className="w-8 h-8" />
                  </div>

                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>

                  <div className="space-y-2 mt-6">
                    <div className="flex items-center justify-center gap-2">
                      {plan.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">MWK {plan.originalPrice}</span>
                      )}
                      <div className="text-4xl font-bold">MWK {plan.price}</div>
                    </div>
                    <div className="text-muted-foreground">{plan.period}</div>
                    {plan.savings && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {plan.savings}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Separator />

                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/i/subscription" className="block">
                    <Button
                      className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                          : plan.color === "blue"
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Why Choose Our AI Platform?</CardTitle>
              <CardDescription>Built specifically for the Malawi market with local payment integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant AI responses and transcriptions with our optimized infrastructure
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Local Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Dedicated customer support team based in Malawi, available in local languages
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Premium Quality</h3>
                  <p className="text-sm text-muted-foreground">
                    Enterprise-grade AI technology accessible at affordable local pricing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept Airtel Money and TNM Mpamba for convenient local payments. More payment options coming soon!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change my plan anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next
                  billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, all new users get a free trial with limited usage to test our platform before subscribing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
