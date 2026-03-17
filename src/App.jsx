import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import client from './sanityClient'


// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════

const CATEGORIES = [
  { id: "All", label: "All Products", emoji: "✦" },
  { id: "tv", label: "TV & Display", emoji: "📺" },
  { id: "fridge", label: "Refrigerators", emoji: "🧊" },
  { id: "washing", label: "Washing Machines", emoji: "💧" },
  { id: "ac", label: "Air Conditioners", emoji: "❄️" },
  { id: "audio", label: "Audio & Speakers", emoji: "🎧" },      
  { id: "camera", label: "Cameras", emoji: "📷" },
  { id: "kitchen", label: "Kitchen Appliances", emoji: "🍳" },
];

const BRANDS = ["Sony","Samsung","LG","Whirlpool","Daikin","Bose","Panasonic","Bosch","Philips","Voltas","Haier","IFB","Godrej","Mitsubishi","Canon"];

const PRODUCTS = [
  { id:1, name:"Sony Bravia 65\" XR OLED 4K", brand:"Sony", price:189900, originalPrice:219900, category:"tv", categoryLabel:"TV & Display", description:"Sony's Cognitive Processor XR mimics the human brain, delivering breathtaking contrast, colour and sound. The OLED panel produces perfect blacks with absolute precision.", longDescription:"Experience entertainment like never before. The Sony BRAVIA XR A80K OLED delivers revolutionary picture quality through the world-first Cognitive Processor XR. Unlike conventional AI, it recognizes what humans find visually important and cross-analyzes an array of elements at once, just like the human brain. Featuring XR OLED Contrast with XR Triluminos Pro for the most natural colors.", stock:5, featured:true, trending:true, badge:"EDITOR'S CHOICE", badgeType:"gold", rating:4.9, reviews:847, specs:[{label:"Screen Size",value:"65 inches OLED"},{label:"Resolution",value:"4K UHD 3840×2160"},{label:"Refresh Rate",value:"120Hz with VRR"},{label:"HDR",value:"Dolby Vision, HDR10"},{label:"Audio",value:"60W Dolby Atmos"},{label:"Smart OS",value:"Google TV"},{label:"Gaming",value:"HDMI 2.1 / 4K@120"},{label:"Warranty",value:"2 Year Sony India"}], highlights:["XR OLED Contrast","Cognitive Processor XR","Acoustic Multi-Audio","PlayStation 5 Ready"], image:"https://images.unsplash.com/photo-1593359677879-a4bb92f4e82a?w=800&q=85", images:["https://images.unsplash.com/photo-1593359677879-a4bb92f4e82a?w=800&q=85","https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=85","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85"], whatsapp:"919876543210", emi:"₹10,550/mo", delivery:"2–3 days", installation:true },
  { id:2, name:"Samsung 55\" Neo QLED 8K", brand:"Samsung", price:134990, originalPrice:159990, category:"tv", categoryLabel:"TV & Display", description:"Samsung Neo QLED with Quantum Matrix Technology Pro delivers extraordinary contrast with AI-powered upscaling to 8K.", longDescription:"Elevate your entertainment with Samsung Neo QLED 8K. Powered by the Neural Quantum Processor 8K, this TV uses AI to upscale all content to near-8K quality. Quantum HDR 2000 delivers over 2000 nits of peak brightness, while the Object Tracking Sound Pro system follows the on-screen action.", stock:8, featured:true, trending:false, badge:"NEW ARRIVAL", badgeType:"blue", rating:4.7, reviews:523, specs:[{label:"Screen Size",value:"55\" Neo QLED"},{label:"Resolution",value:"8K UHD 7680×4320"},{label:"Refresh Rate",value:"144Hz Native"},{label:"HDR",value:"Quantum HDR 2000"},{label:"Processor",value:"Neural Quantum 8K"},{label:"Smart OS",value:"Tizen 7.0"},{label:"Audio",value:"60W OTS Pro"},{label:"Warranty",value:"1 Year Samsung"}], highlights:["144Hz Gaming Mode","Neo Quantum Processor","Multi View","SmartThings Hub"], image:"https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=85", images:["https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=85","https://images.unsplash.com/photo-1593359677879-a4bb92f4e82a?w=800&q=85"], whatsapp:"919876543210", emi:"₹7,499/mo", delivery:"1–2 days", installation:true },
  { id:3, name:"LG InstaView Door-in-Door 687L", brand:"LG", price:119900, originalPrice:139900, category:"fridge", categoryLabel:"Refrigerators", description:"Knock twice to see inside without opening. InstaView with Linear Compressor delivers premium freshness and class-leading energy efficiency.", longDescription:"The LG InstaView Door-in-Door refrigerator transforms how you interact with your fridge. Knock on the InstaView panel twice and the interior lights up so you can see inside without opening the door — reducing cold air loss and keeping food fresher longer.", stock:3, featured:true, trending:true, badge:"TOP SELLER", badgeType:"red", rating:4.8, reviews:1203, specs:[{label:"Capacity",value:"687 Liters"},{label:"Configuration",value:"Side-by-Side"},{label:"Compressor",value:"Inverter Linear"},{label:"Star Rating",value:"3 Star BEE 2024"},{label:"Cooling",value:"Door Cooling+"},{label:"Smart",value:"ThinQ Wi-Fi"},{label:"Noise",value:"< 35dB"},{label:"Warranty",value:"10yr Compressor"}], highlights:["InstaView Knock-Twice","Door Cooling+ 5-Vents","Linear Compressor","ThinQ App Control"], image:"https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=85", images:["https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=85","https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=85"], whatsapp:"919876543210", emi:"₹6,660/mo", delivery:"3–5 days", installation:true },
  { id:4, name:"Whirlpool 8kg Front Load Supreme", brand:"Whirlpool", price:38990, originalPrice:49990, category:"washing", categoryLabel:"Washing Machines", description:"6th Sense Technology adapts automatically. SteamCare removes bacteria. 1400 RPM for near-dry clothes every wash.", longDescription:"The Whirlpool Supreme Care Front Load offers an intelligent washing experience with 6th Sense Technology that automatically adapts water levels, wash time, and spin speed based on load. SteamCare removes 99.9% bacteria and allergens without pre-soaking.", stock:10, featured:false, trending:true, badge:"₹11K OFF", badgeType:"green", rating:4.6, reviews:2341, specs:[{label:"Capacity",value:"8 kg"},{label:"Spin Speed",value:"1400 RPM"},{label:"Programs",value:"16 Wash Programs"},{label:"Technology",value:"6th Sense AI"},{label:"Steam",value:"SteamCare"},{label:"Energy",value:"5 Star BEE"},{label:"Noise",value:"< 54dB"},{label:"Warranty",value:"2yr + 5yr Motor"}], highlights:["6th Sense Auto-Adapt","SteamCare Sanitize","FreshCare+ 6hrs","1400 RPM Spin"], image:"https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=85", images:["https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=85"], whatsapp:"919876543210", emi:"₹2,166/mo", delivery:"2–4 days", installation:true },
  { id:5, name:"Daikin FTKF 1.5T Inverter 5★", brand:"Daikin", price:52990, originalPrice:62990, category:"ac", categoryLabel:"Air Conditioners", description:"Japan-engineered inverter compressor with PM 2.5 filter. Coanda Airflow technology cools every corner evenly.", longDescription:"Daikin is the world's #1 AC brand and this 5-star inverter split AC embodies Japanese engineering excellence. The Neura inverter compressor adjusts speed continuously to maintain exact temperatures. The built-in PM 2.5 filter captures fine dust particles for cleaner air.", stock:7, featured:true, trending:false, badge:"5★ BEE 2024", badgeType:"gold", rating:4.8, reviews:987, specs:[{label:"Capacity",value:"1.5 Ton"},{label:"Star Rating",value:"5 Star BEE 2024"},{label:"Technology",value:"Neura Inverter"},{label:"Refrigerant",value:"R-32 Eco"},{label:"Filter",value:"PM 2.5 + Anti-fungal"},{label:"Smart",value:"Wi-Fi + Alexa"},{label:"ISEER",value:"5.03 (Highest)"},{label:"Warranty",value:"10yr Compressor"}], highlights:["5-Star ISEER 5.03","PM 2.5 Air Filter","R-32 Refrigerant","Coanda Airflow"], image:"https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=85", images:["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=85"], whatsapp:"919876543210", emi:"₹2,944/mo", delivery:"1–3 days", installation:true },
  { id:6, name:"Sony WH-1000XM5 Wireless ANC", brand:"Sony", price:26990, originalPrice:34990, category:"audio", categoryLabel:"Audio & Speakers", description:"Industry-best noise cancellation with dual processors, 8 microphones. 30-hour battery with 3-min quick charge.", longDescription:"The WH-1000XM5 sets a new standard for noise-cancelling headphones. Two processors control 8 microphones with Precise Voice Pickup Technology for crystal-clear calls. LDAC codec supports Hi-Res Audio wirelessly at up to 990kbps.", stock:15, featured:true, trending:true, badge:"BESTSELLER", badgeType:"red", rating:4.9, reviews:4521, specs:[{label:"Driver",value:"30mm Carbon Fiber"},{label:"Battery",value:"30 Hours ANC On"},{label:"Quick Charge",value:"3 min → 3 hours"},{label:"Codec",value:"LDAC / AAC / SBC"},{label:"Microphones",value:"8 Mics Dual Processor"},{label:"NFC",value:"One-touch Pairing"},{label:"Weight",value:"250g"},{label:"Warranty",value:"1 Year Sony India"}], highlights:["Industry-Best ANC","30hr Battery Life","LDAC Hi-Res","Speak-to-Chat"], image:"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=85", images:["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=85","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=85"], whatsapp:"919876543210", emi:"₹1,499/mo", delivery:"Next Day", installation:false },
  { id:7, name:"Bose QuietComfort Ultra Headphones", brand:"Bose", price:31900, originalPrice:39900, category:"audio", categoryLabel:"Audio & Speakers", description:"Bose Immersive Audio places sound all around you. CustomTune calibrates ANC and spatial audio to your ear shape.", longDescription:"The Bose QuietComfort Ultra Headphones are the most advanced Bose headphones ever. Immersive Audio creates a wider, more open soundstage. CustomTune technology personally calibrates noise cancellation and spatial audio to your unique ear shape and fit.", stock:9, featured:false, trending:true, badge:"PREMIUM", badgeType:"gold", rating:4.8, reviews:1876, specs:[{label:"Technology",value:"Bose Immersive Audio"},{label:"Battery",value:"24 Hours"},{label:"Quick Charge",value:"15 min → 2.5 hrs"},{label:"Bluetooth",value:"5.3 Multipoint"},{label:"Fit",value:"CustomTune Calibration"},{label:"Modes",value:"Quiet / Immersive / Aware"},{label:"Weight",value:"254g"},{label:"Warranty",value:"1 Year Bose India"}], highlights:["Immersive Spatial Audio","CustomTune Calibration","3-Mode ANC","BT 5.3 Multipoint"], image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=85", images:["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=85","https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=85"], whatsapp:"919876543210", emi:"₹1,772/mo", delivery:"2–3 days", installation:false },
  { id:8, name:"Samsung 253L Double Door Fridge", brand:"Samsung", price:27990, originalPrice:33990, category:"fridge", categoryLabel:"Refrigerators", description:"Digital Inverter Compressor runs quietly and efficiently. All-Around Cooling ensures every item stays fresh.", longDescription:"Samsung's 253L double door refrigerator is perfect for medium-sized families. The Digital Inverter Compressor adjusts speed according to cooling demand, consuming less energy while running quieter — backed by a 20-year warranty.", stock:14, featured:false, trending:false, badge:"BEST VALUE", badgeType:"green", rating:4.5, reviews:3201, specs:[{label:"Capacity",value:"253 Liters"},{label:"Configuration",value:"Double Door"},{label:"Compressor",value:"Digital Inverter"},{label:"Star Rating",value:"2 Star BEE"},{label:"Cooling",value:"All-Around Cooling"},{label:"Deodorizer",value:"Freshness Guard"},{label:"Ice Maker",value:"Twist Ice Maker"},{label:"Warranty",value:"20yr Compressor"}], highlights:["20yr Compressor Warranty","All-Around Cooling","Twist Ice Maker","Freshness Deodorizer"], image:"https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=85", images:["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=85"], whatsapp:"919876543210", emi:"₹1,555/mo", delivery:"3–5 days", installation:true },
  { id:9, name:"Voltas 1.5T All Season 5★", brand:"Voltas", price:44990, originalPrice:54990, category:"ac", categoryLabel:"Air Conditioners", description:"India's No.1 AC brand. 4-in-1 adjustable cooling with self-cleaning coil. Works up to 55°C outside temp.", longDescription:"Voltas All Season AC is purpose-built for Indian conditions. The 4-in-1 adjustable cooling lets you switch between 0.8T, 1.0T, 1.25T, and 1.5T capacity modes. The inverter compressor works even in extreme Indian summers up to 55°C ambient temperature.", stock:11, featured:false, trending:false, badge:"INDIA #1", badgeType:"blue", rating:4.6, reviews:5632, specs:[{label:"Capacity",value:"1.5 Ton Adjustable"},{label:"Star Rating",value:"5 Star BEE 2024"},{label:"Modes",value:"4-in-1 Adjustable"},{label:"Works At",value:"Up to 55°C"},{label:"Refrigerant",value:"R-32"},{label:"Self-Clean",value:"Auto Cleanser"},{label:"Smart",value:"Wi-Fi Ready"},{label:"Warranty",value:"5yr Compressor"}], highlights:["4-in-1 Adjustable Cooling","Works up to 55°C","Auto Self-Clean","5-Star BEE 2024"], image:"https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=85", images:["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=85"], whatsapp:"919876543210", emi:"₹2,499/mo", delivery:"2–4 days", installation:true },
  { id:10, name:"Canon EOS R50 Mirrorless Kit", brand:"Canon", price:74990, originalPrice:89990, category:"camera", categoryLabel:"Cameras", description:"24.2MP APS-C sensor with DIGIC X processor. Dual Pixel CMOS AF II for blazing-fast subject tracking.", longDescription:"The Canon EOS R50 is the perfect entry into mirrorless photography. The 24.2MP APS-C sensor with DIGIC X processor delivers stunning image quality in any light. 4K 30p video recording with Movie Electronic IS keeps footage steady.", stock:6, featured:false, trending:true, badge:"TRENDING", badgeType:"blue", rating:4.7, reviews:723, specs:[{label:"Sensor",value:"24.2MP APS-C CMOS"},{label:"Processor",value:"DIGIC X"},{label:"AF System",value:"Dual Pixel CMOS AF II"},{label:"Burst",value:"15fps Electronic"},{label:"Video",value:"4K 30p / 1080p 120p"},{label:"Display",value:"2.95\" Vari-Angle Touch"},{label:"Mount",value:"Canon RF-S"},{label:"Warranty",value:"1 Year Canon India"}], highlights:["24.2MP APS-C Sensor","Dual Pixel CMOS AF II","4K 30p Video","15fps Burst Shooting"], image:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=85", images:["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=85","https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=85"], whatsapp:"919876543210", emi:"₹4,166/mo", delivery:"2–3 days", installation:false },
  { id:11, name:"Philips Air Fryer XXL 7.3L HD9651", brand:"Philips", price:14990, originalPrice:19990, category:"kitchen", categoryLabel:"Kitchen Appliances", description:"TurboStar Rapid Air Technology fries with up to 90% less fat. 7.3L family-size basket fits whole chicken.", longDescription:"The Philips XXL Air Fryer uses powerful hot air circulation to cook food crispy on the outside and tender on the inside — with up to 90% less fat than deep frying. The 7.3L XXL capacity can fit an entire whole chicken. The Fat Removal Insert collects excess fat during cooking.", stock:20, featured:false, trending:false, badge:"₹5K OFF", badgeType:"green", rating:4.5, reviews:8921, specs:[{label:"Capacity",value:"7.3 Liters"},{label:"Technology",value:"TurboStar Rapid Air"},{label:"Wattage",value:"2225W"},{label:"Temperature",value:"80°C – 200°C"},{label:"Timer",value:"60 minutes"},{label:"Display",value:"Digital LCD Touch"},{label:"Presets",value:"5 Preset Programs"},{label:"Warranty",value:"2 Year Philips"}], highlights:["90% Less Fat Cooking","7.3L XXL Capacity","TurboStar Technology","Whole Chicken Fit"], image:"https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=85", images:["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=85"], whatsapp:"919876543210", emi:"₹832/mo", delivery:"Next Day", installation:false },
  { id:12, name:"IFB 6kg Fully Auto Top Load", brand:"IFB", price:18490, originalPrice:22990, category:"washing", categoryLabel:"Washing Machines", description:"3D wash system with Aqua Energie breaks down hard water deposits. Cradle Wash protects delicate fabrics.", longDescription:"IFB's 6kg top load with the 3D wash system provides a superior clean through a combination of tumbling, scrubbing, and swinging. Aqua Energie breaks down bicarbonates in hard water, making detergent more effective and clothes softer.", stock:18, featured:false, trending:false, badge:"POPULAR", badgeType:"blue", rating:4.3, reviews:4102, specs:[{label:"Capacity",value:"6 kg"},{label:"Type",value:"Fully Auto Top Load"},{label:"Spin Speed",value:"720 RPM"},{label:"Programs",value:"8 Wash Programs"},{label:"Technology",value:"3D Wash System"},{label:"Hard Water",value:"Aqua Energie"},{label:"Motor",value:"Universal Motor"},{label:"Warranty",value:"2yr + 5yr Motor"}], highlights:["3D Wash System","Aqua Energie Hard Water","Cradle Wash Delicates","Auto-Imbalance Sensing"], image:"https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=85", images:["https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=85"], whatsapp:"919876543210", emi:"₹1,027/mo", delivery:"3–5 days", installation:true },
];

const TESTIMONIALS = [
  { id:1, name:"Priya Sharma", city:"Mumbai", rating:5, product:"Sony Bravia 65\" OLED", text:"Absolutely blown away by the picture quality. The team delivered and installed it perfectly. WhatsApp support was instant — couldn't be happier!", avatar:"PS", color:"#6366f1", date:"2 weeks ago" },
  { id:2, name:"Rajesh Nair", city:"Bangalore", rating:5, product:"Daikin 1.5T Inverter AC", text:"Bought 3 ACs for my office. Price was better than any showroom. Installation was done the very next day by a certified technician. 10/10 experience.", avatar:"RN", color:"#0ea5e9", date:"1 month ago" },
  { id:3, name:"Anita Patel", city:"Ahmedabad", rating:5, product:"LG InstaView Refrigerator", text:"The knock-twice feature is a game-changer! The fridge looks stunning in my kitchen. Got a great deal and free EMI with zero interest. Highly recommend!", avatar:"AP", color:"#10b981", date:"3 weeks ago" },
  { id:4, name:"Vikram Singh", city:"Delhi", rating:5, product:"Sony WH-1000XM5", text:"Best headphones I've ever owned. Noise cancellation is out of this world. Shipped in 1 day. Genuine product with full warranty card.", avatar:"VS", color:"#f59e0b", date:"5 days ago" },
];

// ═══════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════

const fmt = (n) => new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(n);
const disc = (p, o) => Math.round(((o - p) / o) * 100);
const waURL = (p, msg) => `https://wa.me/${p.whatsapp}?text=${encodeURIComponent(msg || `Hi! I'm interested in *${p.name}* (${fmt(p.price)}). Please share availability and best offer.`)}`;

// ═══════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════

const I = {
  Search: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  WA: ({s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  Heart: ({f}) => <svg width="17" height="17" viewBox="0 0 24 24" fill={f?"currentColor":"none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Cart: ({s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  ChevR: ({s=15}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  ArrowL: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  Menu: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X: ({s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Star: ({f=true}) => <svg width="13" height="13" viewBox="0 0 24 24" fill={f?"currentColor":"none"} stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Grid: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  List: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Check: () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Plus: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Truck: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Shield: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Zap: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Tag: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Install: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
};

const Stars = ({ rating }) => (
  <span style={{ display:"flex", gap:2, color:"#f59e0b" }}>
    {[1,2,3,4,5].map(i => <I.Star key={i} f={i <= Math.round(rating)} />)}
  </span>
);

// ═══════════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════════

const GlobalStyles = () => (
  <style>{`
   
    
  `}</style>
);








// ═══════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════

// ── Announcement Bar ──────────────────────────────────────────────
function AnnouncementBar() {
  const msgs = [
    { label: "FREE DELIVERY", text: "on orders above ₹10,000" },
    { label: "ZERO COST EMI", text: "on all products — No interest!" },
    { label: "SANITY + VERCEL", text: "Live inventory updated in real time" },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % msgs.length), 4000);
    return () => clearInterval(t);
  }, []);
  const m = msgs[idx];
  return (
    <div className="ann" style={{ position:"relative", zIndex:201 }}>
      <span className="ann-pill">{m.label}</span>
      <span style={{ color:"rgba(255,255,255,.65)" }}>{m.text}</span>
      <span className="ann-pill" style={{ marginLeft:8 }}>₹0/mo HOSTING</span>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────
function Navbar({ scrolled, page, navigate, cartCount, wishlistCount, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <nav className={`nav ${scrolled ? "sc" : ""}`}>
        <div className="nav-in">
          <button className="logo" onClick={() => navigate("home")}>
            <div className="logo-m">⚡</div>
            <div>
              <div className="logo-t">Electra<em>Shop</em></div>
              <span className="logo-s">Premium Electronics</span>
            </div>
          </button>
          <div className="nav-ctr">
            {["home","products"].map(p => (
              <button key={p} className={`nl ${page===p?"act":""}`} onClick={() => navigate(p)}>
                {p.charAt(0).toUpperCase()+p.slice(1)}
              </button>
            ))}
            <button className="nl" onClick={() => navigate("home")}>About</button>
          </div>
          <div className="nav-r">
            <button className="ni" onClick={onCartOpen} title="Cart">
              <I.Cart s={19} />
              {cartCount > 0 && <span className="nbadge">{cartCount}</span>}
            </button>
            <button className="ni" title="Wishlist" style={{ color: wishlistCount > 0 ? "var(--re)" : "" }}>
              <I.Heart f={wishlistCount>0} />
              {wishlistCount > 0 && <span className="nbadge" style={{ background:"var(--re)" }}>{wishlistCount}</span>}
            </button>
            <a className="nwa" href="https://wa.me/917875061007" target="_blank" rel="noopener noreferrer">
              <I.WA s={16}/> <span>WhatsApp</span>
            </a>
            <button className="nmb" onClick={() => setMenuOpen(true)}>
              <I.Menu />
            </button>
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div className="mn-ov">
          <button className="mn-close" onClick={() => setMenuOpen(false)}><I.X/></button>
          {["Home","Products"].map(p => (
            <button key={p} className={`mn-lnk ${page===p.toLowerCase()?"act":""}`}
              onClick={() => { navigate(p.toLowerCase()); setMenuOpen(false); }}>
              {p}
            </button>
          ))}
          <a className="btn btn-wa" style={{ marginTop:16 }} href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
            <I.WA/> Chat on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────
function HeroBanner({ onShopNow, onViewProduct, products }) {
const featured = products.find(p => p.featured) || products[0];
const [heroProduct, setHeroProduct] = useState(featured);
  const [heroImg, setHeroImg] = useState(0);
  return (
    <section className="hero">
      <div className="h-bg"/>
      <div className="h-grid"/>
      <div className="h-in">
        <div>
          <div className="h-eye fu"><span className="h-dot"/> Live from Sanity CMS</div>
          <h1 className="h-ttl fu fu1">
            Premium Tech,<br/><em>Delivered Fast</em><br/>to Your Door.
          </h1>
          <p className="h-sub fu fu2">
            Curated electronics from Sony, Samsung, LG & more — at competitive prices.
            WhatsApp inquiry, free installation, and zero-hassle delivery across India.
          </p>
          <div className="h-btns fu fu3">
            <button className="btn btn-p" onClick={onShopNow}>
              Browse Products <I.ChevR s={16}/>
            </button>
            <a className="btn btn-s" href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
              <I.WA/> Chat with Us
            </a>
          </div>
          <div className="h-stats fu fu4">
            {[["200+","Products Listed"],["5★","Average Rating"],["₹0","Hidden Charges"],["24/7","WhatsApp Support"]].map(([n,l],i) => (
              <div key={i} className="h-stat">
                <div className="h-sn">{n}</div>
                <div className="h-sl">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-right fu fu2">
          <div className="h-card">
            <img className="h-cimg" src={heroProduct?.images?.[heroImg] || heroProduct?.image} alt="" />
            <div className="h-cbody">
              <div className="h-cbadge">✦ {heroProduct?.badge}</div>
              <div className="h-cname">{heroProduct?.name}</div>
              <div className="h-cfooter">
                <div>
                  <div className="h-cprice">{fmt(heroProduct?.price)}</div>
                  <div className="h-cemi">EMI from {heroProduct?.emi}</div>
                </div>
                <button className="btn btn-p btn-sm" onClick={() => onViewProduct(heroProduct)}>View <I.ChevR s={13}/></button>
              </div>
              {heroProduct?.images?.length > 1 && (
                <div className="h-cthumbs">
                  {heroProduct.images.map((img,i) => (
                    <img key={i} src={img} className={`h-cthumb ${heroImg===i?"act":""}`} onClick={() => setHeroImg(i)} alt="" />
                  ))}
                </div>
              )}
            </div>
            <div className="h-f1">🟢 In Stock — Delivers in {heroProduct?.delivery}</div>
            <div className="h-f2">
              <div className="h-fi">🏆</div>
              <div>
                <div className="h-fn">{heroProduct?.rating} / 5</div>
                <div className="h-fl">{heroProduct?.reviews?.toLocaleString()} reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Trust Bar ─────────────────────────────────────────────────────
function TrustBar() {
  const items = [
    { icon:<I.Truck/>, label:"Free Delivery", sub:"On orders above ₹10,000", bg:"rgba(59,139,245,.12)", col:"var(--ac)" },
    { icon:<I.Shield/>, label:"Official Warranty", sub:"Brand authorized dealer", bg:"rgba(34,197,94,.12)", col:"var(--gr)" },
    { icon:<I.Zap/>, label:"Same-Day Response", sub:"WhatsApp support 9am–9pm", bg:"rgba(245,166,35,.12)", col:"var(--go)" },
    { icon:<I.Tag/>, label:"Best Price Guarantee", sub:"Price match on request", bg:"rgba(239,68,68,.12)", col:"var(--re)" },
    { icon:<I.Install/>, label:"Free Installation", sub:"On all major appliances", bg:"rgba(99,102,241,.12)", col:"var(--a2)" },
  ];
  return (
    <div className="tb">
      <div className="tb-in">
        {items.map((i,k) => (
          <div className="tb-item" key={k}>
            <div className="tb-icon" style={{ background:i.bg, color:i.col }}>{i.icon}</div>
            <div>
              <div className="tb-label">{i.label}</div>
              <div className="tb-sub">{i.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Category Rail ─────────────────────────────────────────────────


function CategoryRail({ categories, onSelect, products }) {
  const [active, setActive] = useState("All");
  const railRef = useRef(null);

  // Duplicate categories for loop effect
  const loopedCategories = [...categories, ...categories];

  const count = (id) =>
    id === "All"
      ? products.length
      : products.filter((p) => p.category === id).length;

  const scroll = (dir) => {
    if (!railRef.current) return;
    railRef.current.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  // Horizontal scroll with mouse wheel
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Infinite scroll reset logic
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const handleScroll = () => {
      const half = el.scrollWidth / 2;

      if (el.scrollLeft >= half) {
        el.scrollLeft = 0;
      }

      if (el.scrollLeft <= 0) {
        el.scrollLeft = half;
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="crl">
      <button className="crl-arrow left" onClick={() => scroll("left")}>
        ◀
      </button>

      <div className="crl-in" ref={railRef}>
        {loopedCategories.map((cat, index) => (
          <button
            key={index}
            className={`cc ${active === cat.id ? "act" : ""}`}
            onClick={() => {
              setActive(cat.id);
              onSelect(cat.id);
            }}
          >
            <span className="cc-em">{cat.emoji}</span>
            {cat.label}
            <span className="cc-ct">{count(cat.id)}</span>
          </button>
        ))}
      </div>

      <button className="crl-arrow right" onClick={() => scroll("right")}>
        ▶
      </button>
    </div>
  );
}



// ── Brands Marquee ────────────────────────────────────────────────
function BrandsMarquee({ brands }) {
  const doubled = [...brands, ...brands];
  return (
    <div className="bm">
      <div className="bm-tr">
        {doubled.map((b, i) => (
          <div className="bm-item" key={`${b}-${i}`}>
            {b}
            <span className="bm-dot"/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Product Badge ─────────────────────────────────────────────────
function Badge({ badge, badgeType }) {
  if (!badge) return null;
  const cls = { gold:"pb-go", red:"pb-re", blue:"pb-bl", green:"pb-gr" }[badgeType] || "pb-bl";
  return <span className={`pb ${cls}`}>{badge}</span>;
}

// ── Stock Status ──────────────────────────────────────────────────
function StockStatus({ stock }) {
  const s = stock === 0 ? "out" : stock <= 3 ? "low" : "in";
  const label = { out:"Out of Stock", low:`Only ${stock} left!`, in:"In Stock" }[s];
  const col = { out:"var(--re)", low:"var(--go)", in:"var(--gr)" }[s];
  return (
    <div className="c-stk" style={{ color:col }}>
      <span className={`sdot ${s==="in"?"si":s==="low"?"sl":"so"}`}/>
      {label}
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────
const ProductCard = memo(function ProductCard({ product, onClick, onQuickView, onAddToCart, onToggleWishlist, wishlist }) {
  const isWished = wishlist.includes(product.id);
  return (
    <div className="pc fu" onClick={() => onClick(product)}>
      <div className="pc-iw">
        <img className="pc-img" src={product.image} alt={product.name} loading="lazy"/>
        <div className="pc-ov"/>
        <div className="pc-bw">
          <Badge badge={product.badge} badgeType={product.badgeType}/>
          {product.trending && <span className="pb pb-bl">🔥 HOT</span>}
        </div>
        <div className="pc-acts">
          <button className={`pc-ab ${isWished?"wl":""}`}
            title="Wishlist"
            onClick={e => { e.stopPropagation(); onToggleWishlist(product.id); }}>
            <I.Heart f={isWished}/>
          </button>
          <button className="pc-ab" title="Quick View"
            onClick={e => { e.stopPropagation(); onQuickView(product); }}>
            <I.Eye/>
          </button>
          <button className="pc-ab" title="Add to Cart"
            onClick={e => { e.stopPropagation(); onAddToCart(product); }}>
            <I.Cart s={16}/>
          </button>
        </div>
      </div>
      <div className="pc-body">
        <div className="c-brand">{product.brand}</div>
        <div className="c-name">{product.name}</div>
        <div className="c-rat">
          <Stars rating={product.rating}/>
          <span style={{ fontSize:12, fontWeight:700, color:"var(--go)" }}>{product.rating}</span>
          <span className="c-rc">({product.reviews?.toLocaleString()})</span>
        </div>
        <div className="c-prow">
          <span className="c-price">{fmt(product.price)}</span>
          {product.originalPrice && <span className="c-orig">{fmt(product.originalPrice)}</span>}
          {product.originalPrice && <span className="c-disc">{disc(product.price, product.originalPrice)}% OFF</span>}
        </div>
        <div className="c-specs">
          {product.specs?.slice(0,3).map((s,i) => (
            <span key={i} className="c-sp">{s.value}</span>
          ))}
        </div>
        <div className="c-ft">
          <StockStatus stock={product.stock}/>
          <a className="c-wa" href={waURL(product)} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}>
            <I.WA s={13}/> Ask
          </a>
        </div>
        <div className="c-emi"><I.Tag/> EMI from <strong>{product.emi}</strong></div>
      </div>
      
    </div>
  );
});

// ── Featured Section ──────────────────────────────────────────────
function FeaturedSection({ products, onViewProduct, onQuickView, onAddToCart, onToggleWishlist, wishlist, onViewAll }) {
  const featured = products.filter(p => p.featured).slice(0,8);
  return (
    <section className="sec">
      <div className="cx">
        <div className="sec-head">
          <div>
            <div className="sec-eye">Featured Picks</div>
            <h2 className="sec-ttl">Handpicked for You</h2>
          </div>
          <button className="btn-gh" onClick={onViewAll}>View All Products <I.ChevR/></button>
        </div>
        <div className="pg">
          {featured.map((p,i) => (
            <div key={p.id} className={`fu fu${Math.min(i+1,6)}`}>
              <ProductCard product={p} onClick={onViewProduct} onQuickView={onQuickView}
                onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlist={wishlist}/>
            </div>
          ))}
        </div>
        {/* Trending Row */}
        <div style={{ marginTop:48 }}>
          <div className="sec-head">
            <div>
              <div className="sec-eye">Trending Now</div>
              <h2 className="sec-ttl">Most Popular This Week</h2>
            </div>
          </div>
          <div className="pg">
            {products.filter(p => p.trending).slice(0,4).map((p,i) => (
              <div key={p.id} className={`fu fu${i+1}`}>
                <ProductCard product={p} onClick={onViewProduct} onQuickView={onQuickView}
                  onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlist={wishlist}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Products Page ─────────────────────────────────────────────────
function ProductsPage({ products, categories, initialCategory, onViewProduct, onQuickView, onAddToCart, onToggleWishlist, wishlist }) {
  const [cat, setCat] = useState(initialCategory || "All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");

  const filtered = useMemo(() => products
    .filter(p => (cat === "All" || p.category === cat))
    .filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()))
    .sort((a,b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "discount") return disc(b.price,b.originalPrice) - disc(a.price,a.originalPrice);
      return (b.featured?1:0) - (a.featured?1:0);
    }), [products, cat, query, sort]);

  return (
    <div className="pp">
      <div className="pp-hdr">
        <div className="cx">
          <div className="sec-eye">Catalogue</div>
          <h1 className="pp-ttl">All Products</h1>
          <p className="pp-sub">Browse {products.length}+ premium electronics from top brands</p>
        </div>
      </div>

      {/* Category Filter Rail */}
      <div style={{ borderBottom:"1px solid var(--b)", overflowX:"auto" }}>
        <div className="crl-in" style={{ paddingTop:16, paddingBottom:12 }}>
          {categories.map(c => (
            <button key={c.id} className={`cc ${cat===c.id?"act":""}`} onClick={() => setCat(c.id)}>
              <span className="cc-em">{c.emoji}</span>{c.label}
              <span className="cc-ct">{c.id==="All"?products.length:products.filter(p=>p.category===c.id).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cx">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="sf">
            <I.Search/>
            <input className="si2" placeholder="Search products, brands..." value={query} onChange={e=>setQuery(e.target.value)}/>
          </div>
          <select className="ss" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Best Discount</option>
          </select>
          <span className="rc">{filtered.length} results</span>
          <div className="vt">
            <button className={`vb ${viewMode==="grid"?"act":""}`} onClick={() => setViewMode("grid")} title="Grid View"><I.Grid/></button>
            <button className={`vb ${viewMode==="list"?"act":""}`} onClick={() => setViewMode("list")} title="List View"><I.List/></button>
          </div>
        </div>

        {/* Results */}
        <div style={{ padding:"28px 0" }}>
          {filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-ic">🔍</div>
              <div style={{ fontSize:18, fontWeight:700, color:"var(--t2)", marginBottom:8 }}>No products found</div>
              <div style={{ fontSize:14 }}>Try adjusting your search or filter</div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="pg">
              {filtered.map((p,i) => (
                <div key={p.id} className={`fu fu${Math.min(i%6+1,6)}`}>
                  <ProductCard product={p} onClick={onViewProduct} onQuickView={onQuickView}
                    onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlist={wishlist}/>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {filtered.map(p => (
                <div key={p.id} className="lc" onClick={() => onViewProduct(p)}>
                  <img className="lc-img" src={p.image} alt={p.name}/>
                  <div className="lc-body">
                    <div className="c-brand" style={{ marginBottom:4 }}>{p.brand}</div>
                    <div className="c-name">{p.name}</div>
                    <div className="c-rat" style={{ margin:"6px 0" }}>
                      <Stars rating={p.rating}/>
                      <span style={{ fontSize:11, color:"var(--tm)" }}>({p.reviews?.toLocaleString()})</span>
                    </div>
                    <div className="c-prow">
                      <span className="c-price">{fmt(p.price)}</span>
                      {p.originalPrice && <span className="c-orig">{fmt(p.originalPrice)}</span>}
                      {p.originalPrice && <span className="c-disc">{disc(p.price,p.originalPrice)}% OFF</span>}
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end", justifyContent:"center", flexShrink:0 }}>
                    <StockStatus stock={p.stock}/>
                    <a className="c-wa" href={waURL(p)} target="_blank" rel="noopener noreferrer"
                      onClick={e=>e.stopPropagation()}>
                      <I.WA s={13}/> Enquire
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Product Detail ────────────────────────────────────────────────
function ProductDetail({ product, products, onBack, onViewProduct, onAddToCart, onToggleWishlist, wishlist }) {
  const [imgIdx, setImgIdx] = useState(0);
  const isWished = wishlist.includes(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0,4);
  const savings = product.originalPrice - product.price;

  useEffect(() => { setImgIdx(0); }, [product.id]);

  return (
    <div className="dp">
      <div className="cx" style={{ paddingTop:24, paddingBottom:60 }}>
        {/* Breadcrumb */}
        <div className="bc">
          <span className="bci" onClick={() => onBack()}>Products</span>
          <span className="bci" style={{ color:"var(--b)", opacity:.6 }}>›</span>
          <span className="bci" onClick={() => onBack()} style={{ color:"var(--t2)" }}>{product.categoryLabel}</span>
          <span style={{ color:"var(--b)", opacity:.6 }}>›</span>
          <span style={{ color:"var(--t1)" }}>{product.name}</span>
        </div>

        <div className="dg">
          {/* Image Gallery */}
          <div className="fu">
            <div className="d-img">
              <img src={product.images?.[imgIdx] || product.image} alt={product.name}/>
            </div>
            {product.images?.length > 1 && (
              <div className="d-thumbs">
                {product.images.map((img,i) => (
                  <div key={i} className={`d-th ${imgIdx===i?"act":""}`} onClick={() => setImgIdx(i)}>
                    <img src={img} alt=""/>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="d-info fu fu2">
            <div className="d-brand-row">
              <span className="d-brand">{product.brand}</span>
              <Badge badge={product.badge} badgeType={product.badgeType}/>
            </div>
            <h1 className="d-ttl">{product.name}</h1>

            <div className="d-rat">
              <Stars rating={product.rating}/>
              <span className="d-rn">{product.rating}</span>
              <span className="d-rv">({product.reviews?.toLocaleString()} verified reviews)</span>
            </div>

            <div className="d-del">
              <I.Truck/>
              <span>Estimated Delivery: <span className="d-del-t">{product.delivery}</span> · {product.installation ? "Free installation included" : "No installation required"}</span>
            </div>

            {/* Price Block */}
            <div className="d-pb">
              <div className="d-pr">
                <span className="d-price">{fmt(product.price)}</span>
                {product.originalPrice && <span className="d-orig">{fmt(product.originalPrice)}</span>}
                {product.originalPrice && <span className="c-disc">{disc(product.price,product.originalPrice)}% OFF</span>}
              </div>
              {savings > 0 && <div className="d-save" style={{ marginBottom:6, fontSize:13 }}>You save {fmt(savings)} 🎉</div>}
              <div className="d-emi">EMI from <strong>{product.emi}</strong> · No-cost EMI available</div>
            </div>

            {/* Highlights */}
            <div className="d-hl">
              <h4>Key Highlights</h4>
              <div className="d-hl-list">
                {product.highlights?.map((h,i) => (
                  <div key={i} className="d-hl-i">
                    <div className="d-hl-ck"><I.Check/></div>
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="d-acts">
              <button className="btn-wa" onClick={() => window.open(waURL(product), "_blank")}>
                <I.WA s={20}/> Enquire on WhatsApp
              </button>
              <button className="d-ac" onClick={() => onAddToCart(product)}>
                <I.Cart s={18}/> Add to Inquiry Cart
              </button>
              <button className={`d-wl ${isWished?"act":""}`} onClick={() => onToggleWishlist(product.id)}>
                <I.Heart f={isWished}/> {isWished ? "Saved to Wishlist" : "Save to Wishlist"}
              </button>
            </div>

            <p style={{ fontSize:13, color:"var(--tm)", textAlign:"center", lineHeight:1.6 }}>
              Our team will contact you within 30 minutes of your WhatsApp enquiry.
            </p>

            {/* Description */}
            <div style={{ marginTop:20, padding:"16px", background:"var(--bg2)", borderRadius:"var(--r)", border:"1px solid var(--b)" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", color:"var(--tm)", marginBottom:10 }}>About This Product</div>
              <p style={{ fontSize:14, color:"var(--t2)", lineHeight:1.8 }}>{product.longDescription || product.description}</p>
            </div>
          </div>
        </div>

        {/* Specs Table */}
        <div style={{ marginTop:48 }}>
          <div className="sec-eye" style={{ marginBottom:16 }}>Specifications</div>
          <div className="spec-tbl">
            <div className="spec-th">Technical Specifications — {product.name}</div>
            {product.specs?.map((s,i) => (
              <div key={i} className="spec-row">
                <div className="spec-k">{s.label}</div>
                <div className="spec-v">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop:56 }}>
            <div className="sec-head">
              <div>
                <div className="sec-eye">More from {product.categoryLabel}</div>
                <h2 className="sec-ttl">You May Also Like</h2>
              </div>
            </div>
            <div className="rg">
              {related.map((p,i) => (
                <div key={p.id} className={`fu fu${i+1}`}>
                  <ProductCard product={p} onClick={onViewProduct}
                    onQuickView={() => {}} onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist} wishlist={wishlist}/>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Testimonials ──────────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section className="sec" style={{ background:"var(--bg2)", borderTop:"1px solid var(--b)" }}>
      <div className="cx">
        <div className="sec-head">
          <div>
            <div className="sec-eye">Customer Stories</div>
            <h2 className="sec-ttl">What Our Customers Say</h2>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"var(--fd)", fontSize:36, fontWeight:900, color:"var(--go)", lineHeight:1 }}>4.9</div>
              <div style={{ fontSize:12, color:"var(--tm)" }}>Overall Rating</div>
            </div>
            <Stars rating={4.9}/>
          </div>
        </div>
        <div className="tg">
          {TESTIMONIALS.map((t,i) => (
            <div key={t.id} className={`tc fu fu${i+1}`}>
              <div className="tc-hd">
                <div className="tc-av" style={{ background:t.color }}>{t.avatar}</div>
                <div>
                  <div className="tc-name">{t.name}</div>
                  <div className="tc-city">📍 {t.city}</div>
                </div>
              </div>
              <div className="tc-prod">Purchased: {t.product}</div>
              <Stars rating={t.rating}/>
              <p className="tc-txt" style={{ marginTop:10 }}>"{t.text}"</p>
              <div className="tc-ft">
                <span className="tc-date">{t.date}</span>
                <span className="tc-ver"><I.Check/> Verified Purchase</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Cart Drawer ───────────────────────────────────────────────────
function CartDrawer({ open, onClose, cart, onRemove, onQtyChange }) {
  if (!open) return null;
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const waMsg = cart.length > 0
    ? `Hi! I'd like to enquire about the following:\n\n${cart.map(i => `• *${i.name}* × ${i.qty} = ${fmt(i.price * i.qty)}`).join("\n")}\n\nTotal: *${fmt(total)}*\n\nPlease confirm availability and best offer.`
    : "";
  return (
    <>
      <div className="co" onClick={onClose}/>
      <div className="cd">
        <div className="cd-hd">
          <span className="cd-ttl">Inquiry Cart</span>
          {cart.length > 0 && <span className="cd-cnt">{cart.length} items</span>}
          <button className="cd-cls" onClick={onClose}>×</button>
        </div>
        <div className="cd-body">
          {cart.length === 0 ? (
            <div className="ce">
              <div className="ce-ic">🛒</div>
              <div style={{ fontWeight:700, fontSize:16, color:"var(--t2)", marginBottom:6 }}>Your cart is empty</div>
              <div style={{ fontSize:13 }}>Add products to send a single WhatsApp inquiry</div>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="ci">
              <img className="ci-img" src={item.image} alt={item.name}/>
              <div className="ci-info">
                <div className="ci-name">{item.name}</div>
                <div className="ci-price">{fmt(item.price)}</div>
                <div className="ci-qr">
                  <button className="qb" onClick={() => onQtyChange(item.id, item.qty - 1)}><I.Minus/></button>
                  <span className="qn">{item.qty}</span>
                  <button className="qb" onClick={() => onQtyChange(item.id, item.qty + 1)}><I.Plus/></button>
                </div>
              </div>
              <button className="ci-rm" onClick={() => onRemove(item.id)}>×</button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="cd-ft">
            <div className="cd-tot">
              <span className="cd-tot-l">Total Enquiry Value</span>
              <span className="cd-tot-p">{fmt(total)}</span>
            </div>
            <a className="btn-wa" href={`https://wa.me/919876543210?text=${encodeURIComponent(waMsg)}`}
              target="_blank" rel="noopener noreferrer">
              <I.WA s={18}/> Send Inquiry via WhatsApp
            </a>
            <p className="cd-note">We'll respond within 30 minutes with pricing & availability</p>
          </div>
        )}
      </div>
    </>
  );
}

// ── Quick View Modal ──────────────────────────────────────────────
function QuickViewModal({ product, onClose, onViewFull, onAddToCart, wishlist, onToggleWishlist }) {
  const isWished = wishlist.includes(product.id);
  return (
    <div className="qv-ov" onClick={onClose}>
      <div className="qv-box" onClick={e => e.stopPropagation()}>
        <button className="qv-cls" onClick={onClose}><I.X s={17}/></button>
        <div className="qv-grid">
          <img className="qv-img" src={product.image} alt={product.name}/>
          <div className="qv-info">
            <div>
              <div className="c-brand" style={{ marginBottom:6 }}>{product.brand}</div>
              <h2 style={{ fontFamily:"var(--fd)", fontSize:"clamp(18px,2.5vw,24px)", fontWeight:900, color:"var(--t1)", lineHeight:1.2, marginBottom:10 }}>{product.name}</h2>
              <div className="c-rat" style={{ marginBottom:12 }}>
                <Stars rating={product.rating}/>
                <span style={{ fontSize:13, fontWeight:700, color:"var(--go)" }}>{product.rating}</span>
                <span className="c-rc">({product.reviews?.toLocaleString()})</span>
              </div>
              <div className="c-prow" style={{ marginBottom:14 }}>
                <span className="c-price">{fmt(product.price)}</span>
                {product.originalPrice && <span className="c-orig">{fmt(product.originalPrice)}</span>}
                {product.originalPrice && <span className="c-disc">{disc(product.price,product.originalPrice)}% OFF</span>}
              </div>
              <p style={{ fontSize:13, color:"var(--t2)", lineHeight:1.7, marginBottom:16 }}>{product.description}</p>
              <div className="c-specs" style={{ marginBottom:16 }}>
                {product.specs?.slice(0,4).map((s,i) => <span key={i} className="c-sp">{s.value}</span>)}
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <a className="btn-wa" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}
                href={waURL(product)} target="_blank" rel="noopener noreferrer">
                <I.WA/> Enquire on WhatsApp
              </a>
              <button className="d-ac" onClick={() => { onAddToCart(product); onClose(); }}>
                <I.Cart s={16}/> Add to Cart
              </button>
              <div style={{ display:"flex", gap:8 }}>
                <button className={`d-wl ${isWished?"act":""}`} style={{ flex:1 }} onClick={() => onToggleWishlist(product.id)}>
                  <I.Heart f={isWished}/> {isWished?"Saved":"Wishlist"}
                </button>
                <button className="btn btn-s btn-sm" style={{ flex:1 }} onClick={onViewFull}>
                  Full Details <I.ChevR s={13}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WhatsApp Float ────────────────────────────────────────────────
function WhatsAppFloat() {
  return (
    <a className="wa-fl" href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
      <I.WA s={26}/>
      <span className="wa-tip">💬 Chat with us!</span>
    </a>
  );
}

// ── Footer ────────────────────────────────────────────────────────
function Footer({ navigate, products }) {
  const cats = CATEGORIES.filter(c => c.id !== "All").slice(0,5);
  return (
    <footer className="footer">
      <div className="cx">
        <div className="fg">
          <div>
            <div className="f-logo">Electra<em>Shop</em></div>
            <p className="f-desc">Your trusted neighbourhood electronics store. Premium brands, honest prices, real after-sales support you can count on.</p>
            <div className="f-social">
              {["📘","📸","🐦","▶️"].map((e,i) => <button key={i} className="fs-btn">{e}</button>)}
            </div>
          </div>
          <div className="f-col">
            <h4>Categories</h4>
            <div className="f-links">
              {cats.map(c => (
                <span key={c.id} className="f-link" onClick={() => navigate("products")}>{c.emoji} {c.label}</span>
              ))}
            </div>
          </div>
          <div className="f-col">
            <h4>Support</h4>
            <div className="f-links">
              {["WhatsApp Us","Call Store","EMI Calculator","Warranty Check","Service Center"].map(l => (
                <span key={l} className="f-link">{l}</span>
              ))}
            </div>
          </div>
          <div className="f-col">
            <h4>Contact</h4>
            <div className="f-links">
              <a className="f-link" href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ color:"var(--wa)" }}>
                📱 +91 98765 43210
              </a>
              <span className="f-link">📍 Your City, India</span>
              <span className="f-link">⏰ Mon–Sat, 10am–8pm</span>
              <span className="f-link">📧 hello@electra.shop</span>
            </div>
            <div style={{ marginTop:16, padding:"12px 16px", background:"var(--ag)", border:"1px solid rgba(59,139,245,.25)", borderRadius:"var(--rs)" }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", color:"var(--ac)", marginBottom:6 }}>Admin Panel</div>
              <div style={{ fontSize:12, color:"var(--t2)" }}>Update products via Sanity Studio — no redeploy needed.</div>
            </div>
          </div>
        </div>
        <div className="f-btm">
          <span className="f-copy">© 2025 ElectraShop. All rights reserved.</span>
          <div className="f-stack">
            Built with <span className="f-badge">React</span> + <span className="f-badge">Sanity</span> + <span className="f-badge">Vercel</span>
            <span style={{ color:"var(--go)", fontWeight:800 }}>₹0/mo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════

export default function App() {



  const [products, setProducts] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const query = `*[_type == 'product'] {
    _id,
    name, brand, price, originalPrice,
    category, categoryLabel, description, longDescription,
    stock, featured, trending, badge, badgeType,
    rating, reviews, emi, delivery, whatsapp, installation,
    specs, highlights,
    'image': image.asset->url,
    'images': gallery[].asset->url
  }`
  
  client.fetch(query)
    .then(data => {
      console.log('✅ Fetched products:', data); // Debug log
      setProducts(data)
      setLoading(false)
    })
    .catch(err => {
      console.error('❌ Sanity fetch error:', err);
      setLoading(false)
      // Show error to user
    })
}, []);



// Add after line 1420 in the main return
{loading && (
  <div style={{
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    zIndex: 9999
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
      <div style={{ color: 'var(--ac)', fontSize: 18, fontWeight: 600 }}>
        Loading products...
      </div>
    </div>
  </div>
)}



  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [initialCat, setInitialCat] = useState("All");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = useCallback((p, cat = "All") => {
    setPage(p); setSelectedProduct(null); setInitialCat(cat);
    window.scrollTo({ top:0, behavior:"smooth" });
  }, []);

  const viewProduct = useCallback((p) => {
    setSelectedProduct(p); setPage("detail");
    window.scrollTo({ top:0, behavior:"smooth" });
  }, []);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? {...i, qty:i.qty+1} : i);
      return [...prev, {...product, qty:1}];
    });
    setCartOpen(true);
  }, []);

  const toggleWishlist = useCallback((id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  return (
    <>
      {/* <GlobalStyles/> */}
      {/* <AnnouncementBar/> */}
      <Navbar
        scrolled={scrolled} page={page} navigate={navigate}
        cartCount={cart.reduce((a,i) => a+i.qty, 0)}
        wishlistCount={wishlist.length}
        onCartOpen={() => setCartOpen(true)}
      />

      <main>
        {page === "home" && (
          <>
            <HeroBanner onShopNow={() => navigate("products")} onViewProduct={viewProduct} products={products}/>
            <TrustBar/>
            <CategoryRail categories={CATEGORIES} onSelect={cat => navigate("products", cat)} products={products}/>
            <BrandsMarquee brands={BRANDS}/>
            <FeaturedSection
              products={products} onViewProduct={viewProduct} onQuickView={setQuickViewProduct}
              onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlist={wishlist}
              onViewAll={() => navigate("products")}
            />
            <TestimonialsSection/>
          </>
        )}
        {page === "products" && (
          <ProductsPage
            products={products} categories={CATEGORIES} initialCategory={initialCat}
            onViewProduct={viewProduct} onQuickView={setQuickViewProduct}
            onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlist={wishlist}
          />
        )}
        {page === "detail" && selectedProduct && (
          <ProductDetail
            product={selectedProduct} products={products} onBack={() => navigate("products")}
            onViewProduct={viewProduct} onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist} wishlist={wishlist}
          />
        )}
      </main>

      <Footer navigate={navigate} products={products}/>
      <WhatsAppFloat/>

      <CartDrawer
        open={cartOpen} onClose={() => setCartOpen(false)} cart={cart}
        onRemove={id => setCart(prev => prev.filter(i => i.id !== id))}
        onQtyChange={(id,qty) => {
          if (qty < 1) setCart(prev => prev.filter(i => i.id !== id));
          else setCart(prev => prev.map(i => i.id === id ? {...i, qty} : i));
        }}
      />

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct} onClose={() => setQuickViewProduct(null)}
          onViewFull={() => { viewProduct(quickViewProduct); setQuickViewProduct(null); }}
          onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist}
        />
      )}
    </>
  );
}
