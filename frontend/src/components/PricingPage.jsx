import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { PublicNavbar } from "./PublicNavbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "./ui/table";
export function PricingPage({ onNavigate }) {
    const plans = [
        {
            name: "Daily",
            price: "₹250",
            period: "per day",
            description: "Perfect for short trips and occasional rides",
            features: {
                "Daily km limit": "100 km",
                "Helmet": true,
                "T-shirt": false,
                "Insurance": "Basic",
                "Priority support": false,
                "Maintenance": "Included",
                "Roadside assistance": false
            }
        },
        {
            name: "Weekly",
            price: "₹1,750",
            period: "per week",
            description: "Great for extended visits and weekly commutes",
            popular: true,
            features: {
                "Weekly km limit": "700 km",
                "Helmet": true,
                "T-shirt": true,
                "Insurance": "Standard",
                "Priority support": false,
                "Maintenance": "Included",
                "Roadside assistance": true
            }
        },
        {
            name: "Monthly Pro",
            price: "₹7,500",
            period: "per month",
            description: "Best value for daily commuters and regular riders",
            features: {
                "Monthly km limit": "Unlimited",
                "Helmet": true,
                "T-shirt": true,
                "Insurance": "Comprehensive",
                "Priority support": true,
                "Maintenance": "Included",
                "Roadside assistance": true
            }
        }
    ];
    const comparisonFeatures = [
        "Daily km limit",
        "Helmet included",
        "T-shirt included",
        "Insurance coverage",
        "Battery swaps",
        "Priority support",
        "Free maintenance",
        "Roadside assistance",
        "Flexible cancellation",
        "Mobile app access"
    ];
    return (<div className="min-h-screen bg-background">
      <PublicNavbar onNavigate={onNavigate}/>
      <div className="container mx-auto px-4 py-12 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-foreground mb-4">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that fits your lifestyle. All plans include insurance and maintenance.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className={`relative h-full flex flex-col ${plan.popular
                ? 'border-primary border-2 shadow-xl'
                : 'hover:border-primary/50'} transition-all duration-300`}>
                {plan.popular && (<div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary px-6">Most Popular</Badge>
                  </div>)}
                
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="mb-2">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                  <div>
                    <span className="text-5xl text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-4 mb-8 flex-1">
                    {Object.entries(plan.features).map(([feature, value], i) => (<li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5"/>
                        <div className="flex-1">
                          <span className="text-sm text-foreground">{feature}:</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                          </span>
                        </div>
                      </li>))}
                  </ul>

                  <Button className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`} variant={plan.popular ? 'default' : 'outline'} onClick={() => onNavigate("dashboard")}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>))}
        </div>

        {/* Detailed Comparison Table */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-16">
          <h2 className="text-foreground text-center mb-8">Detailed Comparison</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Features</TableHead>
                      <TableHead className="text-center">Daily</TableHead>
                      <TableHead className="text-center bg-primary/5">Weekly</TableHead>
                      <TableHead className="text-center">Monthly Pro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>km Limit</TableCell>
                      <TableCell className="text-center">100 km/day</TableCell>
                      <TableCell className="text-center bg-primary/5">700 km/week</TableCell>
                      <TableCell className="text-center">Unlimited</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Helmet</TableCell>
                      <TableCell className="text-center"><Check className="w-5 h-5 text-green-500 mx-auto"/></TableCell>
                      <TableCell className="text-center bg-primary/5"><Check className="w-5 h-5 text-green-500 mx-auto"/></TableCell>
                      <TableCell className="text-center"><Check className="w-5 h-5 text-green-500 mx-auto"/></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>T-shirt</TableCell>
                      <TableCell className="text-center"><X className="w-5 h-5 text-red-500 mx-auto"/></TableCell>
                      <TableCell className="text-center bg-primary/5"><Check className="w-5 h-5 text-green-500 mx-auto"/></TableCell>
                      <TableCell className="text-center"><Check className="w-5 h-5 text-green-500 mx-auto"/></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Insurance</TableCell>
                      <TableCell className="text-center">Basic</TableCell>
                      <TableCell className="text-center bg-primary/5">Standard</TableCell>
                      <TableCell className="text-center">Comprehensive</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Battery Swaps</TableCell>
                      <TableCell className="text-center">₹50/swap</TableCell>
                      <TableCell className="text-center bg-primary/5">₹30/swap</TableCell>
                      <TableCell className="text-center">Free (Unlimited)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Priority Support</TableCell>
                      <TableCell className="text-center"><X className="w-5 h-5 text-red-500 mx-auto"/></TableCell>
                      <TableCell className="text-center bg-primary/5"><X className="w-5 h-5 text-red-500 mx-auto"/></TableCell>
                      <TableCell className="text-center"><Check className="w-5 h-5 text-green-500 mx-auto"/></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Roadside Assistance</TableCell>
                      <TableCell className="text-center"><X className="w-5 h-5 text-red-500 mx-auto"/></TableCell>
                      <TableCell className="text-center bg-primary/5"><Check className="w-5 h-5 text-green-500 mx-auto"/></TableCell>
                      <TableCell className="text-center"><Check className="w-5 h-5 text-green-500 mx-auto"/></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid md:grid-cols-3 gap-6">
          <Card className="bg-muted">
            <CardContent className="p-6">
              <h3 className="text-foreground mb-2">Flexible Plans</h3>
              <p className="text-sm text-muted-foreground">
                Switch between plans anytime. Upgrade or downgrade based on your needs.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardContent className="p-6">
              <h3 className="text-foreground mb-2">No Hidden Charges</h3>
              <p className="text-sm text-muted-foreground">
                What you see is what you pay. No surprise fees or hidden costs.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardContent className="p-6">
              <h3 className="text-foreground mb-2">Cancel Anytime</h3>
              <p className="text-sm text-muted-foreground">
                Not satisfied? Cancel your subscription anytime with no questions asked.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>);
}
