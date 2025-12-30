import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { TrendingUp, Battery, Leaf, Shield, Users, MapPin, DollarSign, ChevronRight, Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { HeroCarousel } from "./HeroCarousel";
import riderImage1 from "../assets/zomato.png";
import riderImage2 from "../assets/ecommerce.png";
import riderImage3 from "../assets/blinkit.png";
import riderImage4 from "../assets/apolo.png";
import stepImg1 from "../assets/1.png";
import stepImg2 from "../assets/2.png";
import stepImg3 from "../assets/3.png";
import stepImg4 from "../assets/4.png";
import stepImg5 from "../assets/5.png";
import { FAQ } from "./FAQ";
function StepImageCarousel() {
    const images = [stepImg1, stepImg2, stepImg3, stepImg4, stepImg5];
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    return (<div className="w-full flex justify-center items-center">
      <img src={images[current]} alt={`Step ${current + 1}`} className="max-w-xs w-full h-auto rounded-2xl shadow-lg transition-all duration-500" style={{ minHeight: 200 }}/>
    </div>);
}
export function NewLandingPage({ onNavigate }) {
	const [currentPair, setCurrentPair] = useState(0);
	// Track which cards have stopped animation
	const [stoppedCards, setStoppedCards] = useState([false, false]);
    const earningOptions = [
        {
            title: "Food Delivery",
            earning: "up to ₹30,000/month",
            description: "Zomato, Swiggy, Uber Eats",
            details: "Optimize your earnings during peak meal hours with our long-range EV rentals. Perfect for flexible, short-burst delivery shifts.",
            image: riderImage2,
            gradient: "from-red-500 to-orange-600"
        },
        {
            title: "E-commerce Delivery",
            earning: "up to ₹45,000/month",
            description: "Amazon, Flipkart, Myntra",
            details: "Become a 10-minute delivery specialist in India’s fastest-growing grocery logistics sector. Benefit from high-frequency orders in hyper-local zones.",
            image: riderImage1,
            gradient: "from-blue-500 to-indigo-600"
        },
        {
            title: "Quick Commerce",
            earning: "up to ₹40,000/month",
            description: "Blinkit, Zepto, Instamart",
            details: "Become a 10-minute delivery specialist in India’s fastest-growing grocery logistics sector. Benefit from high-frequency orders in hyper-local zones.",
            image: riderImage3,
            gradient: "from-yellow-500 to-amber-600"
        },
        {
            title: "Ride Sharing & Porter Services",
            earning: " up to ₹75,000",
            description: "Rapido, Ola, Porter, Dunzo, Uber",
            details: "Maximize your earnings by switching between ride sharing and Porter services. Enjoy unlimited battery swaps and zero fuel costs to keep your business running all day.",
            image: riderImage4,
            gradient: "from-purple-500 to-pink-600"
        }
    ];
	// Auto-swap every 6 seconds, but pause if either card is stopped
	useEffect(() => {
		const interval = setInterval(() => {
			if (!stoppedCards[0] && !stoppedCards[1]) {
				setCurrentPair((prev) => (prev + 2 >= earningOptions.length ? 0 : prev + 2));
			}
		}, 6000);
		return () => clearInterval(interval);
	}, [stoppedCards, earningOptions.length]);
	const visibleOptions = [
		earningOptions[currentPair],
		earningOptions[(currentPair + 1) % earningOptions.length]
	];
    return (<div className="min-h-screen bg-white mt-8">
			{/* Hero Section with Carousel Background */}
			<HeroCarousel>
				<div className="container mx-auto px-4 pt-32 pb-20 flex-1 flex items-center">
					<div className="max-w-4xl mx-auto text-center text-white">
						<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
							<Badge className="mb-6 bg-white/20 backdrop-blur-sm text-white border-white/30 text-lg px-6 py-2">
								🚀 India's #1 EV Rental Platform
							</Badge>
              
							<h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 drop-shadow-2xl">
								Ride <span className="text-white">KWICK</span> EV.<br />
								<span className="text-yellow-300">Earn in Lakhs.</span>
							</h1>
              
							<p className="text-xl md:text-2xl mb-8 leading-relaxed drop-shadow-lg max-w-3xl mx-auto">
								Maximize your income with India’s leading EV rental for Delivery. Earn <span className="text-yellow-300">up to ₹75,000 monthly</span> with premium electric scooters designed for high-performance logistics. Enjoy <span className="text-yellow-300">Zero fuel costs, unlimited battery swaps,</span> 100% eco-friendly rides.
							</p>

							<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
								<Button size="lg" onClick={() => onNavigate("pricing")} className="bg-white text-red-500 hover:bg-gray-100 text-lg px-8 py-6 shadow-2xl">
									Start Earning Today
									<ChevronRight className="ml-2 w-5 h-5"/>
								</Button>
								<Button size="lg" variant="outline" onClick={() => onNavigate("battery-stations")} className="border-white text-white hover:bg-white/20 backdrop-blur-sm text-lg px-8 py-6">
									Find Battery Stations
								</Button>
								<Button size="lg" onClick={() => onNavigate("pricing")} className="bg-white text-red-500 hover:bg-gray-100 text-lg px-8 py-6 shadow-2xl">
									Request a Callback
									<ChevronRight className="ml-2 w-5 h-5"/>
								</Button>
							</div>

							<div className="flex flex-wrap gap-6 justify-center text-sm text-white/90 bg-black/20 backdrop-blur-md rounded-2xl p-4 max-w-2xl mx-auto">
								<div className="flex items-center gap-2">
									<MapPin className="w-5 h-5"/>
									<span>Noida Sector 112</span>
								</div>
								<div className="flex items-center gap-2">
									<Battery className="w-5 h-5"/>
									<span>50+ Battery Stations</span>
								</div>
								<div className="flex items-center gap-2">
									<Leaf className="w-5 h-5"/>
									<span>100% Eco-Friendly</span>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</HeroCarousel>

					{/* Ride Kwick in Simple 5 Steps Section */}
					<section className="py-20 bg-white">
						<div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-12">
							{/* Steps List and Step Image side by side, image smaller and responsive */}
							<div className="w-full md:w-1/2 flex flex-col justify-center">
								<h2 className="text-4xl font-bold mb-8 text-left text-black">Ride Kwick in Simple 5 Steps</h2>
								<div className="space-y-8">
									{[
            { label: "Register to Go", page: "register" },
            { label: "Kwick Identity Check", page: "identity" },
            { label: "Choose Your Ride", page: "choose" },
            { label: "Secure to Pay", page: "payment" },
            { label: "Ride Out", page: "rideout" }
        ].map((step, idx) => (<div key={idx} className="flex items-center gap-6 group cursor-pointer" onClick={() => onNavigate(step.page)}>
											<span className="text-3xl font-bold text-red-500 group-hover:scale-110 transition-transform duration-300">{String.fromCharCode(9312 + idx)}</span>
											<span className="text-xl font-semibold text-black group-hover:text-red-500 transition-colors duration-300">{step.label}</span>
										</div>))}
								</div>
							</div>

							{/* Step Image (auto-swap) - smaller and responsive */}
							<div className="w-full md:w-1/2 flex justify-center items-center">
								<div style={{ minHeight: 200, maxHeight: 700, minWidth: 200, maxWidth: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
									<StepImageCarousel />
								</div>
							</div>
						</div>
					</section>

					{/* Stats Section */}
			<section className="py-20 bg-gray-50">
				<div className="container mx-auto px-4">
					<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
						<h2 className="text-4xl text-black mb-4">KWICK by the Numbers</h2>
						<p className="text-xl text-gray-600">Real impact, real results, real earnings</p>
					</motion.div>

					<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
						{[
            { icon: Users, label: "Active Riders", value: "100+", color: "bg-blue-500" },
            { icon: MapPin, label: "Battery Stations", value: "500+", color: "bg-green-500" },
            { icon: DollarSign, label: "B2B Partners", value: "10+", color: "bg-purple-500" },
            { icon: Leaf, label: "Eco-Friendly", value: "100%", color: "bg-green-600" }
        ].map((stat, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }}>
								<Card className="text-center border-2 hover:border-red-500 transition-all duration-300">
									<CardContent className="p-8">
										<div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
											<stat.icon className="w-8 h-8 text-white"/>
										</div>
										<h3 className="text-4xl text-black mb-2">{stat.value}</h3>
										<p className="text-gray-600">{stat.label}</p>
									</CardContent>
								</Card>
							</motion.div>))}
					</div>
				</div>
			</section>

			{/* Multiple Ways to Earn - ENHANCED WITH IMAGES */}
			<section className="py-20 relative overflow-hidden">
				{/* Blurred Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-white to-red-500/10">
								<div className="absolute inset-0" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(1px) brightness(0.9)',
            opacity: 0.2
        }}></div>
				</div>

				<div className="container mx-auto px-4 relative z-10">
					<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl text-black mb-4">
							Multiple Ways to <span className="text-red-500">Earn</span>
						</h2>
						<p className="text-xl text-gray-700">Choose your earning path with KWICK EV scooters</p>
					</motion.div>

					{/* Animated Earning Cards with Images */}
					<div className="grid md:grid-cols-2 gap-8 mb-12">
						<AnimatePresence mode="sync">
							{visibleOptions.map((option, index) => (
								<motion.div
									key={`${currentPair}-${index}`}
									initial={{ opacity: 0, x: index === 0 ? -100 : 100, rotateY: 90 }}
									animate={{ opacity: 1, x: 0, rotateY: 0 }}
									exit={{ opacity: 0, x: index === 0 ? 100 : -100, rotateY: -90 }}
									transition={{ duration: 0.4, ease: "easeInOut" }}
									className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl group"
									onClick={() => {
										setStoppedCards((prev) => {
											const updated = [...prev];
											updated[index] = true;
											return updated;
										});
									}}
									style={{ cursor: stoppedCards[index] ? 'default' : 'pointer' }}
								>
									{/* Background Image */}
									<div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{
										backgroundImage: `url(${option.image})`,
										filter: 'blur(1px) brightness(0.5)'
									}}></div>

									{/* Gradient Overlay */}
									<div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-80`}></div>

									{/* Content */}
									<div className="relative h-full p-8 flex flex-col justify-between text-white">
										<div>
											<motion.div
												animate={stoppedCards[index] ? {} : {
													scale: [1, 1.05, 1],
													rotate: [0, 5, -5, 0]
												}}
												transition={stoppedCards[index] ? undefined : {
													duration: 10, // much slower
													repeat: Infinity,
													ease: "easeInOut"
												}}
												className="inline-block"
											>
												<Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-lg px-4 py-2">
													{option.title}
												</Badge>
											</motion.div>
											<h3 className="text-4xl mt-4 mb-2 drop-shadow-lg">{option.earning}</h3>
											<p className="text-xl mb-2 text-white/90">{option.description}</p>
											<p className="text-white/80">{option.details}</p>
										</div>

										{/* Delivery Person Image Overlay */}
										<div className="absolute bottom-8 right-8 w-32 h-32 opacity-30 group-hover:opacity-50 transition-opacity">
											<img src={option.image} alt={option.title} className="w-full h-full object-contain filter drop-shadow-2xl"/>
										</div>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</div>

					{/* Earnings Summary */}
					<motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-700 opacity-95"></div>
						<div className="absolute inset-0" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px) brightness(0.4)',
            opacity: 0.3
        }}></div>
            
						<div className="relative p-12 text-center text-white">
							<h3 className="text-3xl md:text-4xl mb-4">
								Average Annual Earnings: <span className="font-bold">₹2.5 - ₹6 Lakhs</span>
							</h3>
							<p className="text-xl mb-6 max-w-3xl mx-auto text-white/90">
								Our top riders earn over ₹50,000 monthly by combining multiple delivery services. Start your journey to financial freedom today!
							</p>
							<Button size="lg" onClick={() => onNavigate("blog")} className="bg-white text-green-600 hover:bg-gray-100">
								Learn How to Maximize Earnings
								<ChevronRight className="ml-2 w-5 h-5"/>
							</Button>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Benefits */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4">
					<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
						<h2 className="text-4xl text-black mb-4">Why Choose KWICK?</h2>
						<p className="text-xl text-gray-600">India's leading EV rental platform for delivery partners.</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8">
						{[
            {
                icon: TrendingUp,
                title: "Maximize Earnings",
                description: "Earn up to ₹75,000 monthly with zero fuel costs",
                color: "bg-green-500"
            },
            {
                icon: Battery,
                title: "Unlimited Swaps",
                description: "500+ battery stations, swap in under 2 minutes",
                color: "bg-blue-500"
            },
            {
                icon: Shield,
                title: "Full Insurance",
                description: "Comprehensive coverage for complete peace of mind",
                color: "bg-purple-500"
            }
        ].map((benefit, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}>
								<Card className="h-full hover:shadow-2xl transition-all">
									<CardContent className="p-8 text-center">
										<div className={`w-16 h-16 ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
											<benefit.icon className="w-8 h-8 text-white"/>
										</div>
										<h3 className="text-xl text-black mb-4">{benefit.title}</h3>
										<p className="text-gray-600">{benefit.description}</p>
									</CardContent>
								</Card>
							</motion.div>))}
					</div>
				</div>
			</section>

			{/* Testimonials */}
			{/* Testimonials */}
			<section className="py-20 bg-gray-50">
				<div className="container mx-auto px-4">
					<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
						<h2 className="text-4xl text-black mb-4">Success Stories</h2>
						<p className="text-xl text-gray-600">Join thousands earning lakhs monthly</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8">
						{[
            {
                name: "Raj Kumar",
                role: "Food Delivery Partner",
                earning: "₹42,000/month",
                review: "KWICK changed my life! Zero fuel costs means more earnings for me.",
                rating: 5
            },
            {
                name: "Deepak Verma ",
                role: "Ride Sharing Partner",
                earning: "₹55,000/month",
                review: "Switching to transportation services was the best move. I earn more every trip because I spend zero on petrol",
                rating: 5
            },
            {
                name: "Amit Singh",
                role: "Quick Commerce",
                earning: "₹45,000/month",
                review: "Professional service, great support team. Highly recommend!",
                rating: 5
            }
        ].map((testimonial, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
								<Card className="h-full">
									<CardContent className="p-8">
										<div className="flex gap-1 mb-4">
											{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400"/>))}
										</div>
										<p className="text-gray-700 mb-6 italic">"{testimonial.review}"</p>
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
												<Users className="w-6 h-6 text-red-500"/>
											</div>
											<div>
												<p className="text-black">{testimonial.name}</p>
												<p className="text-sm text-gray-500">{testimonial.role}</p>
												<p className="text-sm text-green-600">{testimonial.earning}</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>))}
					</div>
				</div>
			</section>

			{/* FAQ Section - inserted after testimonials */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4">
					<FAQ />
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-gradient-to-br from-red-500 to-red-600">
				<div className="container mx-auto px-4 text-center">
					<motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
						<h2 className="text-4xl md:text-5xl text-white mb-6">
							Ready to maximize your income?
						</h2>
						<p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
							Join our growing community of 100+ delivery partners who are boosting their earnings with zero fuel costs and unlimited battery swaps.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button size="lg" onClick={() => onNavigate("pricing")} className="bg-white text-red-500 hover:bg-gray-100">
								View Plans & Pricing
								<ChevronRight className="ml-2 w-5 h-5"/>
							</Button>
							<Button size="lg" onClick={() => onNavigate("contact")} className="bg-white text-red-500 hover:bg-gray-100">
								Contact Us
								<ChevronRight className="ml-2 w-5 h-5"/>
							</Button>
						</div>
					</motion.div>
				</div>
			</section>
		</div>);
}
