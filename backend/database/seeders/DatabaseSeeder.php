<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Category;
use App\Models\Destination;
use App\Models\Review;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

// Real, verified-to-load photos (same curated set used in the web
// frontend's lib/data.ts) — mapped by destination, not arbitrary stock.
class DatabaseSeeder extends Seeder
{
    private const PHOTOS = [
        'ladakh' => 'https://images.unsplash.com/photo-1619837374214-f5b9eb80876d',
        'goa' => 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
        'kerala' => 'https://plus.unsplash.com/premium_photo-1697729438401-fcb4ff66d9a8',
        'rajasthan' => 'https://plus.unsplash.com/premium_photo-1661963054563-ce928e477ff3',
        'bali' => 'https://images.unsplash.com/photo-1555400038-63f5ba517a47',
        'santorini' => 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e',
        'swiss' => 'https://images.unsplash.com/photo-1586752488885-6ce47fdfd874',
        'vietnam' => 'https://images.unsplash.com/photo-1748102289186-f27325fbdc7b',
        'generic' => 'https://images.unsplash.com/photo-1543797414-a0c3ad076f7c',
    ];

    private static function img(string $key, int $w = 1200, int $h = 800): string
    {
        return self::PHOTOS[$key].'?fm=jpg&q=75&w='.$w.'&h='.$h.'&fit=crop&auto=format';
    }

    public function run(): void
    {
        // -- Admin --------------------------------------------------------
        User::create([
            'name' => 'Voyagr Admin',
            'email' => 'admin@voyagr.test',
            'password' => 'password',
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // -- Categories (matches lib/data.ts on the frontend) --------------
        $categoryDefs = [
            ['Domestic', 'MapPin'], ['International', 'Globe2'], ['Adventure', 'MountainSnow'],
            ['Family', 'Users'], ['Solo', 'UserRound'], ['Honeymoon', 'Heart'],
            ['Luxury', 'Gem'], ['Budget', 'Wallet'], ['Wildlife', 'PawPrint'],
            ['Hill Station', 'Trees'], ['Beach', 'Waves'], ['Weekend Trips', 'CalendarDays'],
            ['Cruise', 'Ship'], ['Road Trip', 'Car'],
        ];
        $categories = [];
        foreach ($categoryDefs as $i => [$name, $icon]) {
            $categories[$name] = Category::create([
                'name' => $name, 'slug' => Str::slug($name), 'icon' => $icon, 'sort_order' => $i,
            ]);
        }

        // -- Destinations ---------------------------------------------------
        $destinationDefs = [
            ['Ladakh', 'India', 34.15, 77.58, 'ladakh'],
            ['Goa', 'India', 15.29, 74.12, 'goa'],
            ['Kerala Backwaters', 'India', 9.49, 76.33, 'kerala'],
            ['Bali', 'Indonesia', -8.34, 115.09, 'bali'],
            ['Santorini', 'Greece', 36.39, 25.46, 'santorini'],
            ['Swiss Alps', 'Switzerland', 46.55, 7.98, 'swiss'],
            ['Rajasthan', 'India', 26.91, 75.79, 'rajasthan'],
            ['Vietnam', 'Vietnam', 14.06, 108.28, 'vietnam'],
        ];
        $destinations = [];
        foreach ($destinationDefs as [$name, $country, $lat, $lng, $photoKey]) {
            $destinations[$name] = Destination::create([
                'name' => $name, 'slug' => Str::slug($name), 'country' => $country,
                'latitude' => $lat, 'longitude' => $lng, 'image_path' => self::img($photoKey),
                'is_active' => true,
            ]);
        }

        // -- Agencies ---------------------------------------------------------
        $agencyDefs = [
            ['High Altitude Expeditions', 'Leh, Ladakh', 14, 4.8, 'ladakh',
                'High Altitude Expeditions has run small-group treks and road trips across the Himalayas since 2011. Every guide is a certified mountaineer, and every group is capped at 12 travellers.',
                '+91 98765 43210', 'hello@highaltitudeexpeditions.in', 'highaltitudeexpeditions.in'],
            ['Sunseeker Holidays', 'Panjim, Goa', 9, 4.6, 'goa',
                'Sunseeker runs beach-first getaways across Goa and coastal Karnataka. Their villas and boutique stays are hand-inspected twice a year.',
                '+91 98220 11223', 'care@sunseekerholidays.com', 'sunseekerholidays.com'],
            ['Backwater Trails', 'Alleppey, Kerala', 11, 4.9, 'kerala',
                'A family-run operator that has owned and maintained its own houseboat fleet since 2014 — the highest-rated agency on the platform for Kerala.',
                '+91 94470 55678', 'reservations@backwatertrails.in', 'backwatertrails.in'],
            ['Meridian Getaways', 'Mumbai, Maharashtra', 17, 4.7, 'generic',
                'Meridian is a full-service international outbound agency with local partner offices in 22 countries, specialising in visa-inclusive packages.',
                '+91 22 4011 8899', 'support@meridiangetaways.com', 'meridiangetaways.com'],
            ['Royal Rajasthan Tours', 'Jaipur, Rajasthan', 22, 4.8, 'rajasthan',
                'Royal Rajasthan Tours has been putting together heritage-hotel circuits since 2002, with direct relationships with palace properties.',
                '+91 141 402 5567', 'bookings@royalrajasthantours.com', 'royalrajasthantours.com'],
        ];
        $agencies = [];
        foreach ($agencyDefs as [$name, $city, $years, $rating, $photoKey, $about, $phone, $email, $website]) {
            $owner = User::create([
                'name' => $name.' Owner', 'email' => Str::slug($name).'@voyagr.test',
                'password' => 'password', 'role' => 'agency', 'email_verified_at' => now(),
            ]);

            $agencies[$name] = Agency::create([
                'user_id' => $owner->id, 'name' => $name, 'slug' => Str::slug($name), 'city' => $city,
                'years_experience' => $years, 'rating_avg' => $rating, 'status' => 'verified', 'verified_at' => now(),
                'about' => $about, 'phone' => $phone, 'email' => $email, 'website' => $website,
                'logo_path' => self::img($photoKey, 200, 200), 'cover_path' => self::img($photoKey, 1600, 500),
            ]);
        }

        // -- Reviewer customer accounts (so reviews have a real user_id) ------
        $reviewerNames = [
            'Ankit Verma', 'Priya Nair', 'Rohit Shah', 'Neha Kapoor', 'Sana Imran', 'Devika Menon',
            'Karan Mehta', 'Ritu Sharma', 'Aditi Varun', 'Vikram Oberoi', 'The Kapadia Family',
            'Manish Agarwal', 'Farah Sheikh',
        ];
        $reviewers = [];
        foreach ($reviewerNames as $name) {
            $reviewers[$name] = User::create([
                'name' => $name, 'email' => Str::slug($name).'@voyagr.test',
                'password' => 'password', 'role' => 'customer', 'email_verified_at' => now(),
            ]);
        }

        // -- Tours (matches frontend/lib/data.ts) -----------------------------
        $tourDefs = [
            [
                'slug' => 'ladakh-monasteries-and-passes',
                'title' => 'Ladakh: Monasteries & High Mountain Passes',
                'destination' => 'Ladakh', 'agency' => 'High Altitude Expeditions', 'photo' => 'ladakh',
                'categories' => ['Adventure', 'Domestic'],
                'price' => 34999, 'original_price' => 42999, 'nights' => 6, 'days' => 7,
                'transport' => ['Flight', 'Cab'], 'hotel_rating' => 3, 'meals' => true, 'free_cancel' => true, 'instant' => false,
                'featured' => true, 'trending' => true,
                'highlights' => ['Cross Khardung La, one of the world\'s highest motorable passes', 'Overnight stay beside Pangong Tso', 'Guided monastery circuit: Thiksey, Hemis and Diskit', 'Small group, capped at 12 travellers'],
                'inclusions' => ['6 nights accommodation (hotel + 1 night camp)', 'Daily breakfast and dinner', 'Private oxygen cylinder on board', 'Inner line permits for restricted areas'],
                'exclusions' => ['Airfare to Leh', 'Lunches', 'Personal expenses', 'Travel insurance'],
                'things_to_carry' => ['Warm layered clothing', 'Sunscreen SPF 50+', 'Personal medication', 'Power bank'],
                'itinerary' => [
                    ['Arrive in Leh, acclimatisation', 'Land in Leh and spend the day at low altitude to acclimatise.', ['Dinner'], 'Hotel in Leh'],
                    ['Leh local monasteries', 'Visit Shanti Stupa, Hemis and Thiksey monasteries.', ['Breakfast', 'Dinner'], 'Hotel in Leh'],
                    ['Leh to Nubra Valley via Khardung La', 'Cross Khardung La (17,982 ft) and descend into Nubra Valley.', ['Breakfast', 'Dinner'], 'Camp in Nubra'],
                    ['Nubra to Pangong Tso', 'Drive via Shyok route to Pangong Lake.', ['Breakfast', 'Dinner'], 'Camp at Pangong'],
                    ['Pangong to Leh', 'Return to Leh via Chang La.', ['Breakfast', 'Dinner'], 'Hotel in Leh'],
                    ['Buffer / Magnetic Hill & Sangam', 'Visit Magnetic Hill and the Sangam of Indus and Zanskar rivers.', ['Breakfast', 'Dinner'], 'Hotel in Leh'],
                    ['Departure', 'Transfer to Leh airport for your onward flight.', ['Breakfast'], null],
                ],
                'reviews' => [
                    ['Ankit Verma', 5, 'The guide knew exactly when to push on and when to let us rest at altitude. Never felt unsafe, even on the Khardung La crossing.'],
                    ['Priya Nair', 4, 'Pangong campsite was cold but the sleeping bags provided were genuinely warm. Would have liked one more buffer day.'],
                ],
            ],
            [
                'slug' => 'goa-beach-and-heritage-escape',
                'title' => 'Goa Beach & Portuguese Heritage Escape',
                'destination' => 'Goa', 'agency' => 'Sunseeker Holidays', 'photo' => 'goa',
                'categories' => ['Beach', 'Family', 'Weekend Trips'],
                'price' => 12499, 'original_price' => 15999, 'nights' => 3, 'days' => 4,
                'transport' => ['Flight', 'Cab'], 'hotel_rating' => 4, 'meals' => true, 'free_cancel' => true, 'instant' => true,
                'featured' => true, 'trending' => true,
                'highlights' => ['Beachfront 4-star resort in North Goa', 'Sunset cruise on the Mandovi river', 'Old Goa heritage walk: Basilica of Bom Jesus & Se Cathedral', 'Free cancellation up to 48 hours before departure'],
                'inclusions' => ['3 nights beachfront resort', 'Daily breakfast', 'Airport transfers', 'Sunset river cruise', 'Heritage walking tour'],
                'exclusions' => ['Airfare', 'Lunch and dinner (except Day 2)', 'Water sports', 'Alcoholic beverages'],
                'things_to_carry' => ['Light cottons', 'Sunglasses', 'Reef-safe sunscreen'],
                'itinerary' => [
                    ['Arrival & beach evening', 'Check in, free evening at Candolim beach.', ['Breakfast'], 'Beachfront resort'],
                    ['Old Goa heritage walk + cruise', 'Morning heritage walk through Old Goa\'s UNESCO churches, evening Mandovi sunset cruise.', ['Breakfast', 'Dinner'], 'Beachfront resort'],
                    ['Leisure day', 'Full free day — optional water sports or spice plantation visit.', ['Breakfast'], 'Beachfront resort'],
                    ['Departure', 'Check out and transfer to Goa airport.', ['Breakfast'], null],
                ],
                'reviews' => [
                    ['Rohit Shah', 5, 'Resort was right on the beach, exactly as pictured. The river cruise was the highlight.'],
                    ['Neha Kapoor', 4, 'Good package overall, just wish dinner was included on more nights.'],
                ],
            ],
            [
                'slug' => 'kerala-houseboat-and-hills',
                'title' => 'Kerala Houseboat & Spice Hills',
                'destination' => 'Kerala Backwaters', 'agency' => 'Backwater Trails', 'photo' => 'kerala',
                'categories' => ['Honeymoon', 'Family'],
                'price' => 21999, 'original_price' => 26499, 'nights' => 4, 'days' => 5,
                'transport' => ['Flight', 'Cab'], 'hotel_rating' => 4, 'meals' => true, 'free_cancel' => true, 'instant' => true,
                'featured' => true, 'trending' => false,
                'highlights' => ['Private houseboat overnight stay in Alleppey', 'Tea garden walk in Munnar', 'Spice plantation tour in Thekkady', 'All meals cooked fresh on board the houseboat'],
                'inclusions' => ['1 night private houseboat (all meals)', '3 nights hill resort', 'All transfers', 'Spice plantation entry'],
                'exclusions' => ['Airfare', 'Ayurvedic spa treatments', 'Boat rides at Periyar lake'],
                'things_to_carry' => ['Light rain jacket', 'Comfortable walking shoes', 'Insect repellent'],
                'itinerary' => [
                    ['Arrive Kochi, drive to Munnar', 'Scenic drive up through tea estates, check into hill resort.', ['Dinner'], 'Munnar hill resort'],
                    ['Munnar tea gardens', 'Visit Tea Museum, Mattupetty Dam, and Eravikulam National Park.', ['Breakfast', 'Dinner'], 'Munnar hill resort'],
                    ['Munnar to Thekkady', 'Drive to Thekkady, evening spice plantation walk.', ['Breakfast', 'Dinner'], 'Thekkady resort'],
                    ['Thekkady to Alleppey houseboat', 'Board your private houseboat for an overnight backwater cruise.', ['Breakfast', 'Lunch', 'Dinner'], 'Private houseboat'],
                    ['Disembark & departure', 'Morning cruise back to the jetty, transfer to Kochi airport.', ['Breakfast'], null],
                ],
                'reviews' => [
                    ['Sana Imran', 5, 'The houseboat food alone was worth the trip. Crew was warm and the boat was spotless.'],
                    ['Devika Menon', 5, 'Booked this for our anniversary — the agency upgraded our boat\'s deck room without us asking.'],
                ],
            ],
            [
                'slug' => 'bali-island-hopping',
                'title' => 'Bali Island Hopping: Ubud to Nusa Penida',
                'destination' => 'Bali', 'agency' => 'Meridian Getaways', 'photo' => 'bali',
                'categories' => ['International', 'Honeymoon', 'Beach'],
                'price' => 68999, 'original_price' => 79999, 'nights' => 6, 'days' => 7,
                'transport' => ['Flight', 'Cab'], 'hotel_rating' => 4, 'meals' => true, 'free_cancel' => false, 'instant' => true,
                'featured' => false, 'trending' => true,
                'highlights' => ['Rice terrace sunrise trek in Ubud', 'Day trip to Nusa Penida\'s Kelingking Beach', 'Private pool villa for two nights', 'Visa assistance included'],
                'inclusions' => ['6 nights (mix of resort and pool villa)', 'Daily breakfast', 'Nusa Penida day trip with speedboat', 'Visa processing'],
                'exclusions' => ['International airfare', 'Lunch and dinner (except welcome dinner)', 'Optional water sports'],
                'things_to_carry' => ['Valid passport (6 months validity)', 'Swimwear', 'Light trekking shoes'],
                'itinerary' => [
                    ['Arrive Denpasar, transfer to Ubud', 'Evening at leisure, welcome dinner at a local warung.', ['Dinner'], 'Ubud resort'],
                    ['Ubud rice terraces & temples', 'Sunrise trek at Tegallalang, visit Tirta Empul water temple.', ['Breakfast'], 'Ubud resort'],
                    ['Ubud to Seminyak', 'Transfer to Seminyak, free evening at Seminyak beach.', ['Breakfast'], 'Seminyak resort'],
                    ['Nusa Penida day trip', 'Speedboat to Nusa Penida, visit Kelingking Beach.', ['Breakfast'], 'Seminyak resort'],
                    ['Transfer to Uluwatu pool villa', 'Check into private pool villa, evening Kecak fire dance.', ['Breakfast'], 'Uluwatu pool villa'],
                    ['Leisure day at the villa', 'Full free day by your private pool.', ['Breakfast'], 'Uluwatu pool villa'],
                    ['Departure', 'Transfer to Denpasar airport.', ['Breakfast'], null],
                ],
                'reviews' => [
                    ['Karan Mehta', 5, 'The pool villa in Uluwatu was the standout — better than what we paid double for elsewhere previously.'],
                    ['Ritu Sharma', 4, 'Nusa Penida day was long (12+ hours) but absolutely worth it.'],
                ],
            ],
            [
                'slug' => 'santorini-aegean-dream',
                'title' => 'Santorini Aegean Dream',
                'destination' => 'Santorini', 'agency' => 'Meridian Getaways', 'photo' => 'santorini',
                'categories' => ['International', 'Luxury', 'Honeymoon'],
                'price' => 145999, 'original_price' => 168999, 'nights' => 5, 'days' => 6,
                'transport' => ['Flight', 'Cab'], 'hotel_rating' => 5, 'meals' => true, 'free_cancel' => false, 'instant' => false,
                'featured' => true, 'trending' => false,
                'highlights' => ['Caldera-view suite with private plunge pool', 'Private catamaran sunset cruise', 'Wine tasting at a family-run Santorini vineyard', 'Schengen visa assistance included'],
                'inclusions' => ['5 nights caldera-view suite', 'Daily breakfast', 'Private catamaran cruise', 'Vineyard tour with tastings', 'Visa assistance'],
                'exclusions' => ['International airfare', 'Lunch and dinner (except cruise dinner)', 'Travel insurance'],
                'things_to_carry' => ['Valid passport with Schengen visa', 'Comfortable walking sandals'],
                'itinerary' => [
                    ['Arrive Santorini', 'Private transfer to your caldera-view suite in Oia.', ['Dinner'], 'Oia caldera suite'],
                    ['Oia village & sunset point', 'Explore Oia\'s blue-domed churches, evening at the sunset viewpoint.', ['Breakfast'], 'Oia caldera suite'],
                    ['Private catamaran cruise', 'Sail the caldera, swim at the volcanic hot springs.', ['Breakfast', 'Dinner'], 'Oia caldera suite'],
                    ['Vineyard & Pyrgos village', 'Wine tasting at a family vineyard, wander Pyrgos village.', ['Breakfast'], 'Oia caldera suite'],
                    ['Leisure day', 'Free day — optional spa treatments or Akrotiri site visit.', ['Breakfast'], 'Oia caldera suite'],
                    ['Departure', 'Transfer to Santorini airport.', ['Breakfast'], null],
                ],
                'reviews' => [
                    ['Aditi Varun', 5, 'Booked for our honeymoon — the plunge pool suite view alone made the price worth it.'],
                ],
            ],
            [
                'slug' => 'swiss-alps-scenic-rail',
                'title' => 'Swiss Alps Scenic Rail Journey',
                'destination' => 'Swiss Alps', 'agency' => 'Meridian Getaways', 'photo' => 'swiss',
                'categories' => ['International', 'Luxury', 'Hill Station'],
                'price' => 189999, 'original_price' => 214999, 'nights' => 7, 'days' => 8,
                'transport' => ['Flight', 'Train'], 'hotel_rating' => 4, 'meals' => true, 'free_cancel' => false, 'instant' => false,
                'featured' => false, 'trending' => false,
                'highlights' => ['Glacier Express panoramic rail journey', 'Jungfraujoch, the \'Top of Europe\'', 'Lake cruise on Lake Lucerne', 'Swiss Travel Pass included for all trains'],
                'inclusions' => ['7 nights 4-star hotels', 'Daily breakfast', 'Swiss Travel Pass', 'Jungfraujoch entry', 'Lake Lucerne cruise'],
                'exclusions' => ['International airfare', 'Lunch and dinner', 'Travel insurance'],
                'things_to_carry' => ['Warm layered jacket', 'Comfortable walking shoes', 'Valid Schengen visa'],
                'itinerary' => [
                    ['Arrive Zurich', 'Transfer to hotel, evening walk along the Limmat river.', ['Dinner'], 'Zurich hotel'],
                    ['Zurich to Lucerne', 'Scenic train to Lucerne, afternoon lake cruise.', ['Breakfast'], 'Lucerne hotel'],
                    ['Mount Pilatus', 'Cable car and cogwheel railway up Mount Pilatus.', ['Breakfast'], 'Lucerne hotel'],
                    ['Lucerne to Interlaken', 'Travel to Interlaken via scenic rail.', ['Breakfast'], 'Interlaken hotel'],
                    ['Jungfraujoch', 'Full day at the \'Top of Europe\', including the ice palace.', ['Breakfast'], 'Interlaken hotel'],
                    ['Interlaken to Zermatt via Glacier Express', 'Board the iconic Glacier Express through the Alps.', ['Breakfast'], 'Zermatt hotel'],
                    ['Zermatt & the Matterhorn', 'Gornergrat railway for close-up Matterhorn views.', ['Breakfast'], 'Zermatt hotel'],
                    ['Departure', 'Transfer to Zurich for your flight home.', ['Breakfast'], null],
                ],
                'reviews' => [
                    ['Vikram Oberoi', 5, 'The Glacier Express day was the best travel day I\'ve had. Every hotel was walking distance from the station.'],
                ],
            ],
            [
                'slug' => 'royal-rajasthan-palace-circuit',
                'title' => 'Royal Rajasthan: Palaces & Desert Forts',
                'destination' => 'Rajasthan', 'agency' => 'Royal Rajasthan Tours', 'photo' => 'rajasthan',
                'categories' => ['Domestic', 'Luxury', 'Family'],
                'price' => 46999, 'original_price' => 54999, 'nights' => 6, 'days' => 7,
                'transport' => ['Cab', 'Train'], 'hotel_rating' => 5, 'meals' => true, 'free_cancel' => true, 'instant' => true,
                'featured' => true, 'trending' => true,
                'highlights' => ['Two nights in a converted heritage palace', 'Sunset camel safari in the Thar desert', 'Private guided tour of Amber Fort', 'Traditional Rajasthani thali dinner with folk performance'],
                'inclusions' => ['6 nights heritage & 5-star hotels', 'Daily breakfast and dinner', 'AC private vehicle throughout', 'All monument entry fees', 'Camel safari'],
                'exclusions' => ['Airfare/train fare to Jaipur', 'Lunches', 'Camera fees at monuments'],
                'things_to_carry' => ['Light cottons + a light shawl for evenings', 'Comfortable walking shoes', 'Sunglasses'],
                'itinerary' => [
                    ['Arrive Jaipur', 'Check into hotel, evening at leisure in the Pink City.', ['Dinner'], 'Jaipur hotel'],
                    ['Jaipur city & Amber Fort', 'Amber Fort, City Palace, Hawa Mahal and Jantar Mantar.', ['Breakfast', 'Dinner'], 'Jaipur hotel'],
                    ['Jaipur to Jodhpur', 'Drive to Jodhpur, evening at Mehrangarh Fort.', ['Breakfast', 'Dinner'], 'Jodhpur heritage hotel'],
                    ['Jodhpur to Jaisalmer', 'Drive to Jaisalmer, visit the Golden Fort at sunset.', ['Breakfast', 'Dinner'], 'Jaisalmer heritage hotel'],
                    ['Thar desert safari', 'Afternoon jeep safari and sunset camel ride with folk dinner.', ['Breakfast', 'Dinner'], 'Desert camp'],
                    ['Jaisalmer to Udaipur', 'Transfer to Udaipur, evening boat ride on Lake Pichola.', ['Breakfast', 'Dinner'], 'Udaipur lakeside hotel'],
                    ['Departure', 'Visit City Palace Udaipur before transfer to airport.', ['Breakfast'], null],
                ],
                'reviews' => [
                    ['The Kapadia Family', 5, 'Travelled with two grandparents and two kids — the pace was well planned so no one was ever exhausted.'],
                    ['Manish Agarwal', 5, 'Our driver-guide across all 6 days knew more history than most tour guides at the forts themselves.'],
                ],
            ],
            [
                'slug' => 'vietnam-north-to-south',
                'title' => 'Vietnam North to South Explorer',
                'destination' => 'Vietnam', 'agency' => 'Meridian Getaways', 'photo' => 'vietnam',
                'categories' => ['International', 'Adventure'],
                'price' => 58999, 'original_price' => 67999, 'nights' => 6, 'days' => 7,
                'transport' => ['Flight', 'Cab'], 'hotel_rating' => 4, 'meals' => true, 'free_cancel' => true, 'instant' => true,
                'featured' => false, 'trending' => true,
                'highlights' => ['Overnight cruise on Halong Bay', 'Street food walking tour in Hanoi\'s Old Quarter', 'Cu Chi Tunnels day trip from Ho Chi Minh City', 'Domestic flight between Hanoi and Ho Chi Minh included'],
                'inclusions' => ['6 nights hotels + 1 night cruise cabin', 'Daily breakfast', 'Domestic flight Hanoi-HCMC', 'Halong Bay cruise with meals', 'Cu Chi Tunnels entry'],
                'exclusions' => ['International airfare', 'Visa fee', 'Lunch and dinner (except on cruise)'],
                'things_to_carry' => ['Light breathable clothing', 'Comfortable shoes for walking tours', 'E-visa printout'],
                'itinerary' => [
                    ['Arrive Hanoi', 'Evening street food walking tour in the Old Quarter.', ['Dinner'], 'Hanoi hotel'],
                    ['Hanoi to Halong Bay', 'Board your overnight cruise, sunset on the top deck.', ['Breakfast', 'Lunch', 'Dinner'], 'Halong Bay cruise cabin'],
                    ['Halong Bay to Hanoi, fly to Ho Chi Minh City', 'Morning kayaking, disembark and fly south.', ['Breakfast', 'Lunch'], 'Ho Chi Minh City hotel'],
                    ['Cu Chi Tunnels', 'Full day trip to the Cu Chi Tunnels and War Remnants Museum.', ['Breakfast'], 'Ho Chi Minh City hotel'],
                    ['Mekong Delta', 'Boat trip through the Mekong Delta\'s floating markets.', ['Breakfast'], 'Ho Chi Minh City hotel'],
                    ['Leisure day', 'Free day for shopping at Ben Thanh Market.', ['Breakfast'], 'Ho Chi Minh City hotel'],
                    ['Departure', 'Transfer to Tan Son Nhat airport.', ['Breakfast'], null],
                ],
                'reviews' => [
                    ['Farah Sheikh', 5, 'The overnight cruise cabin was nicer than expected for the price point.'],
                ],
            ],
        ];

        foreach ($tourDefs as $i => $def) {
            $tour = Tour::create([
                'agency_id' => $agencies[$def['agency']]->id,
                'destination_id' => $destinations[$def['destination']]->id,
                'title' => $def['title'],
                'slug' => $def['slug'],
                'description' => 'Search once across verified travel agencies — see the same trip priced honestly, book with one consistent cancellation policy.',
                'price' => $def['price'],
                'original_price' => $def['original_price'],
                'duration_nights' => $def['nights'],
                'duration_days' => $def['days'],
                'hotel_rating' => $def['hotel_rating'],
                'transport' => $def['transport'],
                'meals_included' => $def['meals'],
                'free_cancellation' => $def['free_cancel'],
                'instant_confirmation' => $def['instant'],
                'highlights' => $def['highlights'],
                'inclusions' => $def['inclusions'],
                'exclusions' => $def['exclusions'],
                'things_to_carry' => $def['things_to_carry'],
                'status' => 'published',
                'featured' => $def['featured'],
                'trending' => $def['trending'],
                'approved_at' => now(),
                'views_count' => rand(200, 4000),
            ]);

            $tour->categories()->attach(Category::whereIn('name', $def['categories'])->pluck('id'));

            foreach ($def['itinerary'] as $day => [$title, $desc, $meals, $stay]) {
                $tour->itineraryDays()->create([
                    'day_number' => $day + 1, 'title' => $title, 'description' => $desc,
                    'meals' => $meals, 'stay_name' => $stay,
                ]);
            }

            $tour->tourDates()->createMany([
                ['departure_date' => now()->addDays(10 + $i), 'seats_total' => 12, 'seats_available' => rand(2, 6), 'status' => 'open'],
                ['departure_date' => now()->addDays(24 + $i), 'seats_total' => 12, 'seats_available' => rand(6, 12), 'status' => 'open'],
                ['departure_date' => now()->addDays(38 + $i), 'seats_total' => 12, 'seats_available' => 12, 'status' => 'open'],
            ]);

            $tour->images()->createMany([
                ['path' => self::img($def['photo']), 'type' => 'image', 'sort_order' => 0],
                ['path' => self::img($def['photo'], 1200, 801), 'type' => 'image', 'sort_order' => 1],
                ['path' => self::img($def['photo'], 1199, 800), 'type' => 'image', 'sort_order' => 2],
            ]);

            $ratingSum = 0;
            foreach ($def['reviews'] as [$authorName, $rating, $text]) {
                Review::create([
                    'tour_id' => $tour->id,
                    'user_id' => $reviewers[$authorName]->id,
                    'agency_id' => $agencies[$def['agency']]->id,
                    'rating' => $rating,
                    'review_text' => $text,
                    'status' => 'published',
                ]);
                $ratingSum += $rating;
            }
            $reviewCount = count($def['reviews']);
            $tour->update([
                'rating_avg' => $reviewCount ? round($ratingSum / $reviewCount, 1) : 0,
                'review_count' => $reviewCount,
            ]);
        }

        $this->command?->info('Seeded: 1 admin, 5 agencies, 14 categories, 8 destinations, 8 tours with reviews.');
    }
}
