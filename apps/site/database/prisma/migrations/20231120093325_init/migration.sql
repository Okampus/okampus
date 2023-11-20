-- CreateEnum
CREATE TYPE "Colors" AS ENUM ('Blue', 'DeepBlue', 'DarkBlue', 'LightBlue', 'Green', 'DeepGreen', 'DarkGreen', 'LightGreen', 'Orange', 'DeepOrange', 'DarkOrange', 'LightOrange', 'Red', 'DeepRed', 'DarkRed', 'LightRed', 'Purple', 'DeepPurple', 'DarkPurple', 'LightPurple', 'Gray', 'DeepGray', 'DarkGray', 'Turquoise', 'Pink', 'Cyan', 'Brown', 'Indigo', 'Lime', 'Teal', 'Transparent');

-- CreateEnum
CREATE TYPE "ApprovalState" AS ENUM ('Approved', 'Rejected', 'Pending', 'Canceled');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('Bank', 'LegalUnit', 'Team', 'Tenant', 'User');

-- CreateEnum
CREATE TYPE "ActorImageType" AS ENUM ('Avatar', 'Banner', 'Gallery');

-- CreateEnum
CREATE TYPE "BankAccountInfoStatus" AS ENUM ('Enabled', 'Disabled');

-- CreateEnum
CREATE TYPE "MoneyAccountType" AS ENUM ('Primary', 'Secondary', 'Cash');

-- CreateEnum
CREATE TYPE "EventState" AS ENUM ('Template', 'Draft', 'Submitted', 'Rejected', 'Approved', 'Published', 'Canceled');

-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('Link', 'File');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('Public', 'VisibleAfterJoin');

-- CreateEnum
CREATE TYPE "EventImageType" AS ENUM ('Banner', 'Venue', 'Gallery', 'Album');

-- CreateEnum
CREATE TYPE "ProcessedVia" AS ENUM ('Automatic', 'Manual', 'QR');

-- CreateEnum
CREATE TYPE "LegalUnitUniqueCodeType" AS ENUM ('SIRET', 'FINESS', 'WikiData');

-- CreateEnum
CREATE TYPE "LogContext" AS ENUM ('User', 'Bot', 'CRON', 'Seeding', 'System');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('Create', 'Update', 'Delete', 'Hide');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('Event', 'EventRegular', 'EventRange', 'Internal', 'Other');

-- CreateEnum
CREATE TYPE "SocialType" AS ENUM ('Discord', 'GitHub', 'TikTok', 'LinkedIn', 'Instagram', 'Facebook', 'Twitch', 'WhatsApp', 'YouTube');

-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('ClassGroup', 'Cohort', 'Tag', 'TeamCategory', 'Transaction');

-- CreateEnum
CREATE TYPE "TeamType" AS ENUM ('Association', 'Club', 'Project');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('Announcement', 'Event', 'Form', 'Poll', 'Question', 'Answer', 'Reply', 'Comment');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('Like', 'Love', 'Haha', 'Wow', 'Support', 'Genius');

-- CreateEnum
CREATE TYPE "ApproximateDate" AS ENUM ('Exact', 'Year', 'Month', 'Day', 'Time');

-- CreateEnum
CREATE TYPE "TeamHistoryType" AS ENUM ('Defunct', 'Restart', 'ActivityEnd', 'AcitivityStart', 'LegalStart', 'LegalEnd', 'RegularAssembly', 'ExtraordinaryAssembly', 'OkampusEnd', 'OkampusStart');

-- CreateEnum
CREATE TYPE "TeamRoleType" AS ENUM ('President', 'Treasurer', 'Secretary', 'DirectorRole', 'ManagerRole');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Balance', 'BankTransfer', 'Cash', 'Check', 'CreditCard', 'DirectDebit', 'MobilePayment');

-- CreateEnum
CREATE TYPE "TeamPaymentMethodType" AS ENUM ('Card', 'Mobile', 'Other');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Balance', 'BankingFees', 'Gift', 'Subvention', 'Communication', 'Subscription', 'MembershipFees', 'TicketFees', 'Travel', 'Income', 'Expense', 'ExpenseClaim', 'Groceries', 'Equipment');

-- CreateEnum
CREATE TYPE "TenantRoleType" AS ENUM ('Administration', 'Student', 'Teacher');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('Country', 'State', 'County', 'Suburb', 'District', 'City', 'Postcode', 'Street', 'Amenity', 'Unknown');

-- CreateEnum
CREATE TYPE "AmenityType" AS ENUM ('Accommodation', 'Hotel', 'Hut', 'Apartment', 'Chalet', 'GuestHouse', 'Hostel', 'Motel', 'Activity', 'CommunityCenter', 'SportClub', 'Commercial', 'Supermarket', 'Marketplace', 'ShoppingMall', 'DepartmentStore', 'Electronics', 'OutdoorAndSport', 'WaterSports', 'Ski', 'Diving', 'Hunting', 'Bicycle', 'Fishing', 'Golf', 'Vehicle', 'Hobby', 'Model', 'Anime', 'Collecting', 'Games', 'Brewing', 'Photo', 'Music', 'SewingAndKnitting', 'HobbyArtShop', 'Books', 'GiftAndSouvenir', 'Stationery', 'Newsagent', 'TicketsAndLottery', 'Clothing', 'Shoes', 'Clothes', 'Underwear', 'Sport', 'Men', 'Women', 'Kids', 'Accessories', 'Bag', 'BabyGoods', 'Agrarian', 'GardenCenter', 'HousewareAndHardware', 'DoItYourself', 'HardwareAndTools', 'BuildingMaterials', 'Paint', 'Glaziery', 'Doors', 'Tiles', 'Windows', 'Flooring', 'Fireplace', 'SwimmingPool', 'Florist', 'FurnitureAndInterior', 'Lighting', 'Curtain', 'Carpet', 'Kitchen', 'Bed', 'Bathroom', 'Chemist', 'HealthAndBeauty', 'PharmacyStore', 'Optician', 'MedicalSupply', 'HearingAids', 'Herbalist', 'Cosmetics', 'Wigs', 'ToyAndGame', 'Pet', 'FoodAndDrink', 'Bakery', 'Deli', 'FrozenFood', 'Pasta', 'Spices', 'Organic', 'HoneyStore', 'RiceStore', 'NutsStore', 'HealthFoodStore', 'IceCreamStore', 'SeafoodStore', 'FruitAndVegetable', 'Farm', 'Confectionery', 'Chocolate', 'Butcher', 'CheeseAndDairy', 'Drinks', 'CoffeeAndTea', 'Convenience', 'DiscountStore', 'Smoking', 'SecondHand', 'Gas', 'Weapons', 'Pyrotechnics', 'Energy', 'Wedding', 'Jewelry', 'Watches', 'ArtStore', 'AntiqueStore', 'VideoAndMusic', 'Erotic', 'Trade', 'Kiosk', 'Catering', 'Restaurant', 'SteakHouse', 'Chili', 'RestaurantPizza', 'RestaurantBurger', 'RestaurantRegional', 'RestaurantItalian', 'RestaurantChinese', 'RestaurantSandwich', 'RestaurantChicken', 'RestaurantMexican', 'RestaurantJapanese', 'RestaurantAmerican', 'RestaurantKebab', 'RestaurantIndian', 'RestaurantAsian', 'RestaurantSushi', 'RestaurantFrench', 'RestaurantGerman', 'RestaurantThai', 'RestaurantGreek', 'RestaurantSeafood', 'RestaurantFishAndChips', 'RestaurantInternational', 'RestaurantTexMex', 'RestaurantVietnamese', 'RestaurantTurkish', 'RestaurantKorean', 'RestaurantNoodle', 'RestaurantBarbecue', 'RestaurantSpanish', 'RestaurantFish', 'RestaurantRamen', 'RestaurantMediterranean', 'RestaurantFriture', 'RestaurantBeefBowl', 'RestaurantLebanese', 'RestaurantWings', 'RestaurantGeorgian', 'RestaurantTapas', 'RestaurantIndonesian', 'RestaurantArab', 'RestaurantPortuguese', 'RestaurantRussian', 'RestaurantFilipino', 'RestaurantAfrican', 'RestaurantMalaysian', 'RestaurantCaribbean', 'RestaurantPeruvian', 'RestaurantBavarian', 'RestaurantBrazilian', 'RestaurantCurry', 'RestaurantDumpling', 'RestaurantPersian', 'RestaurantArgentinian', 'RestaurantOriental', 'RestaurantBalkan', 'RestaurantMoroccan', 'RestaurantPita', 'RestaurantEthiopian', 'RestaurantTaiwanese', 'RestaurantLatinAmerican', 'RestaurantHawaiian', 'RestaurantIrish', 'RestaurantAustrian', 'RestaurantCroatian', 'RestaurantDanish', 'RestaurantTacos', 'RestaurantBolivian', 'RestaurantHungarian', 'RestaurantWestern', 'RestaurantEuropean', 'RestaurantJamaican', 'RestaurantCuban', 'RestaurantSoup', 'RestaurantUzbek', 'RestaurantNepalese', 'RestaurantCzech', 'RestaurantSyrian', 'RestaurantAfghan', 'RestaurantMalay', 'RestaurantBelgian', 'RestaurantUkrainian', 'RestaurantSwedish', 'RestaurantPakistani', 'FastFood', 'FastFoodPizza', 'FastFoodBurger', 'FastFoodSandwich', 'FastFoodKebab', 'FastFoodFishAndChips', 'FastFoodNoodle', 'FastFoodRamen', 'FastFoodWings', 'FastFoodTapas', 'FastFoodPita', 'FastFoodTacos', 'FastFoodSoup', 'FastFoodSalad', 'FastFoodHotDog', 'Cafe', 'CoffeeShop', 'DonutShop', 'BubbleTeaShop', 'WaffleShop', 'IceCreamShop', 'CrepeShop', 'CakeShop', 'FrozenYogurtShop', 'DessertShop', 'FoodCourt', 'Coffee', 'Tea', 'Bar', 'Pub', 'Biergarten', 'Taproom', 'Education', 'School', 'DrivingSchool', 'MusicSchool', 'LanguageSchool', 'Library', 'College', 'University', 'Childcare', 'Kindergarten', 'Entertainment', 'Culture', 'Theatre', 'ArtsCenter', 'Gallery', 'Zoo', 'Aquarium', 'Planetarium', 'Museum', 'Cinema', 'AmusementArcade', 'EscapeGame', 'MiniatureGolf', 'BowlingAlley', 'FlyingFox', 'ThemePark', 'WaterPark', 'ActivityPark', 'ActivityParkTrampoline', 'ActivityParkClimbing', 'Healthcare', 'ClinicOrPraxis', 'Allergology', 'VascularSurgery', 'Urology', 'Trauma', 'Rheumatology', 'Radiology', 'Pulmonology', 'Psychiatry', 'Paediatrics', 'Otolaryngology', 'Orthopaedics', 'Ophthalmology', 'Occupational', 'Gynaecology', 'General', 'Gastroenterology', 'Endocrinology', 'Dermatology', 'Cardiology', 'Dentist', 'DentistOrthodontics', 'Hospital', 'Pharmacy', 'Heritage', 'UNESCO', 'Leisure', 'Picnic', 'PicnicSite', 'PicnicTable', 'BBQ', 'Playground', 'Spa', 'SpaPublicBath', 'SpaSauna', 'Park', 'Garden', 'NatureReserve', 'ManMade', 'Pier', 'Breakwater', 'Tower', 'WaterTower', 'Bridge', 'Lighthouse', 'Windmill', 'Watermill', 'Natural', 'Forest', 'Water', 'WaterSpring', 'WaterReef', 'WaterHotSpring', 'WaterGeyser', 'WaterSea', 'Mountain', 'MountainPeak', 'MountainGlacier', 'MountainCliff', 'MountainRock', 'MountainCaveEntrance', 'Sand', 'SandDune', 'ProtectedArea', 'NationalPark', 'Office', 'Government', 'GovernmentAdministrative', 'GovernmentRegisterOffice', 'GovernmentTax', 'GovernmentPublicService', 'GovernmentMinistry', 'GovernmentHealthcare', 'GovernmentProsecutor', 'GovernmentTransportation', 'GovernmentSocialServices', 'GovernmentLegislative', 'GovernmentEducation', 'GovernmentCustoms', 'GovernmentSocialSecurity', 'GovernmentEnvironment', 'GovernmentMigration', 'GovernmentCadaster', 'GovernmentForestry', 'GovernmentAgriculture', 'Company', 'EstateAgent', 'Insurance', 'Lawyer', 'Telecommunication', 'EducationalInstitution', 'Association', 'NonProfit', 'Diplomatic', 'IT', 'Accountant', 'EmploymentAgency', 'ReligiousOffice', 'Research', 'Architect', 'Financial', 'TaxAdvisor', 'AdvertisingAgency', 'Notary', 'Newspaper', 'PoliticalParty', 'Logistics', 'EnergySupplier', 'TravelAgent', 'FinancialAdvisor', 'Consulting', 'Foundation', 'Coworking', 'WaterUtility', 'Forestry', 'Charity', 'Security', 'Parking', 'ParkingCars', 'ParkingCarsSurface', 'ParkingCarsMultistorey', 'ParkingCarsUnderground', 'ParkingCarsRooftop', 'ParkingSurface', 'ParkingMultistorey', 'ParkingUnderground', 'ParkingRooftop', 'ParkingMotorcycle', 'ParkingBicycles', 'PetPlace', 'PetShop', 'PetVeterinary', 'PetService', 'PetDogPark', 'Rental', 'RentalCar', 'RentalStorage', 'RentalBicycle', 'RentalBoat', 'RentalSki', 'Service', 'FinancialService', 'ATM', 'PaymentTerminal', 'Bank', 'BureauDeChange', 'MoneyTransfer', 'MoneyLender', 'CleaningService', 'Lavoir', 'Laundry', 'DryCleaning', 'TravelAgency', 'PostService', 'PostOffice', 'PostBox', 'Police', 'VehicleService', 'FuelStation', 'CarWash', 'ChargingStation', 'VehicleRepair', 'CarRepair', 'MotorcycleRepair', 'BeautyService', 'Hairdresser', 'BeautySpa', 'Massage', 'Tailor', 'FuneralDirectors', 'Bookmaker', 'EstateAgentService', 'Locksmith', 'Taxi', 'SocialFacility', 'SocialFacilityShelter', 'SocialFacilityFood', 'SocialFacilityClothers', 'Tourism', 'Information', 'InformationOffice', 'InformationMap', 'RangerStation', 'Attraction', 'AttractionArtwork', 'AttractionViewpoint', 'AttractionFountain', 'AttractionClock', 'Sights', 'ReligiousSights', 'PlaceOfWorshipChurch', 'PlaceOfWorshipChapel', 'PlaceOfWorshipCathedral', 'PlaceOfWorshipMosque', 'PlaceOfWorshipSynagogue', 'PlaceOfWorshipTemple', 'PlaceOfWorshipShrine', 'Monastery', 'CityHall', 'ConferenceCenter', 'MemorialLighthouse', 'MemorialWindmill', 'MemorialTower', 'Battlefield', 'Fort', 'Castle', 'Ruins', 'ArchaeologicalSite', 'CityGate', 'MemorialBridge', 'Memorial', 'MemorialAircraft', 'MemorialLocomotive', 'MemorialRailwayCar', 'MemorialShip', 'MemorialTank', 'MemorialTomb', 'MemorialMonument', 'MemorialWaysideCross', 'MemorialBoundaryStone', 'MemorialPillory', 'MemorialMilestone', 'Religion', 'PlaceOfWorship', 'PlaceOfWorshipBuddhism', 'PlaceOfWorshipChristianity', 'PlaceOfWorshipHinduism', 'PlaceOfWorshipIslam', 'PlaceOfWorshipJudaism', 'PlaceOfWorshipShinto', 'PlaceOfWorshipSikhism', 'PlaceOfWorshipMultifaith', 'Camping', 'CampPitch', 'CampSite', 'SummerCamp', 'CaravanSite', 'Amenity', 'Toilet', 'DrinkingWater', 'GiveBox', 'GiveBoxFood', 'GiveBoxBooks', 'Beach', 'BeachResort', 'Adult', 'Nightclub', 'Stripclub', 'Swingerclub', 'Brothel', 'Casino', 'AdultGamingCenter', 'Airport', 'InternationalAirport', 'Building', 'ResidentialBuilding', 'CommercialBuilding', 'IndustrialBuilding', 'OfficeBuilding', 'CateringBuilding', 'HealthcareBuilding', 'UniversityBuilding', 'CollegeBuilding', 'DormitoryBuilding', 'SchoolBuilding', 'DrivingSchoolBuilding', 'KindergartenBuilding', 'PublicAndCivilBuilding', 'SportBuilding', 'SpaBuilding', 'PlaceOfWorshipBuilding', 'HolidayHouseBuilding', 'AccommodationBuilding', 'TourismBuilding', 'TransportationBuilding', 'MilitaryBuilding', 'ServiceBuilding', 'FacilityBuilding', 'GarageBuilding', 'ParkingBuilding', 'ToiletBuilding', 'PrisonBuilding', 'EntertainmentBuilding', 'HistoricBuilding', 'SkiInfrastructure', 'SkiLift', 'CableCarLift', 'GondolaLift', 'MixedLift', 'ChairLift', 'TowLineLift', 'MagicCarpetLift', 'SportInfrastructure', 'Stadium', 'DiveCenter', 'HorseRiding', 'IceRink', 'Pitch', 'SportsCenter', 'SwimmingPoolCenter', 'Track', 'Fitness', 'FitnessCenter', 'FitnessStation', 'PublicTransport', 'Train', 'LightRail', 'Monorail', 'Subway', 'SubwayEntrance', 'Bus', 'Tram', 'Ferry', 'Aerialway', 'Administrative', 'ContinentLevel', 'CountryLevel', 'CountryPartLevel', 'StateLevel', 'CountyLevel', 'CityLevel', 'DistrictLevel', 'SuburbLevel', 'NeighbourhoodLevel', 'PostalCode', 'Political', 'LowEmissionZone', 'PopulatedPlace', 'Hamlet', 'Village', 'Neighbourhood', 'Suburb', 'Town', 'CityBlock', 'Quarter', 'City', 'Allotments', 'County', 'Municipality', 'District', 'Region', 'State', 'Borough', 'Subdistrict', 'Province', 'Township', 'Production', 'Factory', 'Winery', 'Brewery', 'CheeseFactory', 'PotteryFactory');

-- CreateEnum
CREATE TYPE "CountryCode" AS ENUM ('AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KR', 'KP', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'T1', 'VN', 'VG', 'VI', 'XX', 'WF', 'EH', 'YE', 'ZA', 'ZM', 'ZW');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYR', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK', 'JEP', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SPL', 'SRD', 'STD', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TVD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWD');

-- CreateTable
CREATE TABLE "actor" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "type" "ActorType" NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "banner" TEXT,
    "status" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL DEFAULT '',
    "email" TEXT,
    "website" TEXT,
    "ical" TEXT NOT NULL DEFAULT id_generator(21),

    CONSTRAINT "actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actor_image" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "order" SMALLINT,
    "actorId" BIGINT NOT NULL,
    "imageId" BIGINT NOT NULL,
    "type" "ActorImageType" NOT NULL,

    CONSTRAINT "actor_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actor_tag" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "createdById" BIGINT,
    "actorId" BIGINT NOT NULL,
    "tagId" BIGINT NOT NULL,

    CONSTRAINT "actor_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_role" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "userId" BIGINT NOT NULL,
    "tenantId" BIGINT,
    "canCreateTenant" BOOLEAN NOT NULL DEFAULT false,
    "canManageTenantEntities" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteTenantEntities" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "admin_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank" (
    "goCardLessInstitutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "legalUnitId" BIGINT,
    "bic" TEXT NOT NULL,
    "transactionTotalDays" SMALLINT NOT NULL DEFAULT 90,
    "actorId" BIGINT NOT NULL,
    "countries" "CountryCode"[],

    CONSTRAINT "bank_pkey" PRIMARY KEY ("goCardLessInstitutionId")
);

-- CreateTable
CREATE TABLE "bank_requisition" (
    "goCardLessRequisitionId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "validatedAt" TIMESTAMPTZ(0),
    "accountsLastAccessedAt" TIMESTAMPTZ(0),
    "transactionsLastAccessed" TIMESTAMPTZ(0),
    "authorizationLink" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "teamId" BIGINT NOT NULL,

    CONSTRAINT "bank_requisition_pkey" PRIMARY KEY ("goCardLessRequisitionId")
);

-- CreateTable
CREATE TABLE "bank_info" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "accountsLastAccessedAt" TIMESTAMPTZ(0) DEFAULT CURRENT_TIMESTAMP,
    "actorId" BIGINT NOT NULL,
    "bankId" TEXT,
    "branchGeoapifyAddressId" TEXT,
    "iban" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL DEFAULT '',
    "ownerAddress" TEXT NOT NULL DEFAULT '',
    "status" "BankAccountInfoStatus" NOT NULL DEFAULT 'Enabled',

    CONSTRAINT "bank_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "money_account" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "name" TEXT NOT NULL DEFAULT '',
    "details" TEXT NOT NULL DEFAULT '',
    "type" "MoneyAccountType" NOT NULL DEFAULT 'Primary',
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "balance" REAL NOT NULL DEFAULT 0,
    "balanceReferenceDate" TIMESTAMPTZ(0),
    "balanceShouldRenewDate" TIMESTAMPTZ(0),
    "balanceShouldRenewFrequency" TEXT,
    "parentId" BIGINT,
    "goCardLessBankAccountId" TEXT,
    "bankAccountInfoId" BIGINT,
    "goCardLessRequisitionId" TEXT,
    "teamId" BIGINT NOT NULL,

    CONSTRAINT "money_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_location" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "geoapifyAddressId" TEXT,
    "tenantLocationClusterId" BIGINT NOT NULL,

    CONSTRAINT "tenant_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_location_cluster" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "tenant_location_cluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "start" TIMESTAMPTZ(0) NOT NULL,
    "end" TIMESTAMPTZ(0),
    "locationDetails" TEXT,
    "locationName" VARCHAR(40),
    "geoapifyAddressId" TEXT,
    "tenantLocationId" BIGINT,
    "locationLinkId" BIGINT,
    "summary" TEXT NOT NULL,
    "description" TEXT,
    "banner" TEXT,
    "price" REAL NOT NULL DEFAULT 0,
    "pointsAwardedForAttendance" REAL NOT NULL DEFAULT 0,
    "maxParticipants" SMALLINT,
    "state" "EventState" NOT NULL DEFAULT 'Draft',
    "isAutoAcceptingJoins" BOOLEAN NOT NULL DEFAULT true,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "joinFormId" BIGINT,
    "eventApprovalSubmissionId" BIGINT,
    "nextApprovalStepId" BIGINT,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "createdById" BIGINT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" VARCHAR(40) NOT NULL,
    "type" "LinkType" NOT NULL DEFAULT 'Link',
    "visibility" "Visibility" NOT NULL DEFAULT 'Public',

    CONSTRAINT "link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_link" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "createdById" BIGINT,
    "linkId" BIGINT NOT NULL,
    "eventId" BIGINT NOT NULL,

    CONSTRAINT "event_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_image" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "order" SMALLINT,
    "eventId" BIGINT NOT NULL,
    "imageId" BIGINT NOT NULL,
    "type" "EventImageType" NOT NULL,

    CONSTRAINT "event_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_approval" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "message" TEXT NOT NULL DEFAULT '',
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "eventId" BIGINT,
    "eventApprovalStepId" BIGINT,

    CONSTRAINT "event_approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_approval_step" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "order" SMALLINT NOT NULL,
    "description" VARCHAR(255) NOT NULL DEFAULT '',
    "previousStepId" BIGINT,

    CONSTRAINT "event_approval_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_approval_step_validator" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "stepId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "canValidate" BOOLEAN NOT NULL DEFAULT false,
    "isNotified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "event_approval_step_validator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "eventId" BIGINT,
    "postId" BIGINT,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_join" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "state" "ApprovalState" NOT NULL DEFAULT 'Pending',
    "isPresent" BOOLEAN,
    "processedById" BIGINT,
    "processedAt" TIMESTAMPTZ(0),
    "participationProcessedById" BIGINT,
    "participationProcessedAt" TIMESTAMPTZ(0),
    "participationProcessedVia" "ProcessedVia",
    "eventId" BIGINT NOT NULL,
    "joinedById" BIGINT NOT NULL,
    "qrCodeId" BIGINT,
    "missionJoinId" BIGINT,
    "joinFormSubmissionId" BIGINT,

    CONSTRAINT "event_join_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_organize" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "description" TEXT NOT NULL DEFAULT '',
    "eventId" BIGINT NOT NULL,
    "teamId" BIGINT NOT NULL,
    "projectId" BIGINT,

    CONSTRAINT "event_organize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_supervisor" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "title" TEXT,
    "userId" BIGINT NOT NULL,
    "eventOrganizeId" BIGINT NOT NULL,

    CONSTRAINT "event_supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenseClaim" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "description" TEXT NOT NULL,
    "state" "ApprovalState" NOT NULL DEFAULT 'Pending',
    "lastNotifiedAt" TIMESTAMPTZ(0),
    "tranactionId" BIGINT,
    "processedById" BIGINT,
    "processedAt" TIMESTAMPTZ(0),
    "expenseClaimReportId" BIGINT NOT NULL,
    "bankAccountInfoId" BIGINT NOT NULL,

    CONSTRAINT "expenseClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_upload" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT,
    "linkedFormSubmissionId" BIGINT,
    "grantId" BIGINT,
    "grantAllocateId" BIGINT,
    "formSubmissionId" BIGINT,
    "locationId" BIGINT,
    "transactionId" BIGINT,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "file_upload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT NOT NULL,
    "deletedAt" TIMESTAMPTZ(0),
    "followedActorId" BIGINT NOT NULL,

    CONSTRAINT "follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "schema" JSONB NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isAllowingMultipleAnswers" BOOLEAN NOT NULL DEFAULT false,
    "isAllowingEditingAnswers" BOOLEAN NOT NULL DEFAULT true,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_submission" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "submission" JSONB NOT NULL,
    "formId" BIGINT NOT NULL,

    CONSTRAINT "form_submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grant" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "askedAmount" REAL NOT NULL,
    "receivedAmount" REAL NOT NULL,
    "state" "ApprovalState" NOT NULL DEFAULT 'Pending',
    "receivedAmountProcessedById" BIGINT,
    "receivedAmountProcessedAt" TIMESTAMPTZ(0),
    "teamId" BIGINT NOT NULL,
    "signatureId" BIGINT,
    "generatedDocumentId" BIGINT,

    CONSTRAINT "grant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grant_allocate" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "askedAmount" REAL NOT NULL,
    "receivedAmount" REAL,
    "state" "ApprovalState" NOT NULL DEFAULT 'Pending',
    "receivedAmountProcessedById" BIGINT,
    "receivedAmountProcessedAt" TIMESTAMPTZ(0),
    "grantId" BIGINT NOT NULL,
    "transactionId" BIGINT,
    "signatureId" BIGINT,
    "generatedDocumentId" BIGINT,

    CONSTRAINT "grant_allocate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_unit" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "createdById" BIGINT,
    "slug" TEXT NOT NULL,
    "legalName" VARCHAR(255) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isBrand" BOOLEAN NOT NULL DEFAULT false,
    "actorId" BIGINT NOT NULL,
    "parentId" BIGINT,
    "brandId" BIGINT,
    "tenantGrantFundId" BIGINT,
    "geoapifyAddressId" TEXT,

    CONSTRAINT "legal_unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_unit_unique_code" (
    "deletedAt" TIMESTAMPTZ(0),
    "country" "CountryCode" NOT NULL,
    "codeType" "LegalUnitUniqueCodeType" NOT NULL,
    "code" TEXT NOT NULL,
    "legalUnitId" BIGINT NOT NULL,

    CONSTRAINT "legal_unit_unique_code_pkey" PRIMARY KEY ("country","codeType","legalUnitId")
);

-- CreateTable
CREATE TABLE "log" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "type" "LogType" NOT NULL,
    "context" "LogContext" NOT NULL,
    "diff" JSONB NOT NULL DEFAULT '{}',
    "entityName" TEXT NOT NULL,
    "entityId" BIGINT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "teamId" BIGINT,
    "transactionId" BIGINT,
    "eventId" BIGINT,
    "userId" BIGINT,
    "tenantId" BIGINT,

    CONSTRAINT "log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMPTZ(0),
    "pointsMinimum" SMALLINT NOT NULL,
    "pointsMaximum" SMALLINT NOT NULL,
    "quantity" SMALLINT NOT NULL DEFAULT 1,
    "remainingQuantity" SMALLINT NOT NULL DEFAULT 1,
    "isAutoAccepting" BOOLEAN NOT NULL DEFAULT false,
    "isManagerJob" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "color" "Colors" NOT NULL DEFAULT 'Blue',
    "eventOrganizeId" BIGINT,
    "teamRoleId" BIGINT,
    "projectId" BIGINT,
    "userId" BIGINT,
    "teamId" BIGINT NOT NULL,

    CONSTRAINT "mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_join" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "state" "ApprovalState" NOT NULL DEFAULT 'Pending',
    "points" SMALLINT,
    "processedById" BIGINT,
    "processedAt" TIMESTAMPTZ(0),
    "pointsProcessedById" BIGINT,
    "pointsProcessedAt" TIMESTAMPTZ(0),
    "missionId" BIGINT NOT NULL,
    "joinedById" BIGINT NOT NULL,
    "projectId" BIGINT,
    "eventJoinId" BIGINT,

    CONSTRAINT "mission_join_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL,
    "color" "Colors" NOT NULL DEFAULT 'Blue',
    "type" "ProjectType" NOT NULL DEFAULT 'Other',
    "regularEventInterval" TEXT NOT NULL DEFAULT '',
    "start" TIMESTAMPTZ(0),
    "end" TIMESTAMPTZ(0),
    "budget" REAL NOT NULL DEFAULT 0,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "teamId" BIGINT NOT NULL,
    "bannerId" BIGINT,
    "grantId" BIGINT,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_supervisor" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "title" TEXT,
    "userId" BIGINT NOT NULL,
    "projectId" BIGINT NOT NULL,

    CONSTRAINT "project_supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "required_document" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "teamTypes" "TeamType"[] DEFAULT ARRAY[]::"TeamType"[],
    "isRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "required_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "required_role" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "color" "Colors" NOT NULL DEFAULT 'Blue',
    "description" TEXT NOT NULL DEFAULT '',
    "teamTypes" "TeamType"[] DEFAULT ARRAY[]::"TeamType"[],
    "isRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "required_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "ip" VARCHAR(255) NOT NULL,
    "device" JSONB NOT NULL,
    "country" "CountryCode" NOT NULL,
    "refreshTokenHash" VARCHAR(255) NOT NULL,
    "tokenFamily" VARCHAR(255) NOT NULL,
    "userId" BIGINT NOT NULL,
    "lastActivityAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastIssuedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMPTZ(0),

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "actorId" BIGINT NOT NULL,
    "order" SMALLINT NOT NULL,
    "type" "SocialType" NOT NULL,
    "pseudo" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "type" "TagType" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "ownerActorId" BIGINT,
    "color" "Colors" NOT NULL DEFAULT 'Transparent',

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "type" "TeamType" NOT NULL DEFAULT 'Club',
    "slug" TEXT NOT NULL,
    "video" TEXT,
    "membershipFees" REAL NOT NULL DEFAULT 0,
    "membershipDuration" TEXT NOT NULL DEFAULT '',
    "directorsCategoryName" TEXT NOT NULL DEFAULT 'Directors',
    "managersCategoryName" TEXT NOT NULL DEFAULT 'Managers',
    "membersCategoryName" TEXT NOT NULL DEFAULT 'Members',
    "expectingPresidentEmail" TEXT,
    "expectingTreasurerEmail" TEXT,
    "expectingSecretaryEmail" TEXT,
    "isOnboardingComplete" BOOLEAN NOT NULL DEFAULT true,
    "isJoinFormActive" BOOLEAN NOT NULL DEFAULT true,
    "joinFormId" BIGINT,
    "actorId" BIGINT NOT NULL,
    "tenantGrantFundId" BIGINT,
    "parentId" BIGINT,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actor_cluster" (
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "createdById" BIGINT,
    "actorId" BIGINT NOT NULL,
    "tenantLocationClusterId" BIGINT NOT NULL,

    CONSTRAINT "actor_cluster_pkey" PRIMARY KEY ("actorId","tenantLocationClusterId")
);

-- CreateTable
CREATE TABLE "post" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "createdById" BIGINT,
    "content" TEXT NOT NULL,
    "type" "PostType" NOT NULL,
    "replyToId" BIGINT,
    "eventId" BIGINT,
    "teamId" BIGINT,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reaction" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "createdById" BIGINT NOT NULL,
    "postId" BIGINT NOT NULL,
    "type" "ReactionType" NOT NULL,

    CONSTRAINT "reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_document" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "yearVersion" SMALLINT,
    "fileUploadId" BIGINT,
    "teamId" BIGINT NOT NULL,
    "requiredDocumentId" BIGINT,

    CONSTRAINT "team_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_history" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "happenedAt" TIMESTAMPTZ(0) NOT NULL,
    "approximateDate" "ApproximateDate" NOT NULL,
    "type" "TeamHistoryType" NOT NULL,
    "teamId" BIGINT NOT NULL,

    CONSTRAINT "team_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_join" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "state" "ApprovalState" NOT NULL DEFAULT 'Pending',
    "processedById" BIGINT,
    "processedAt" TIMESTAMPTZ(0),
    "joinFormSubmissionId" BIGINT,
    "joinedById" BIGINT NOT NULL,
    "teamId" BIGINT NOT NULL,

    CONSTRAINT "team_join_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_member" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "teamId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "team_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_member_role" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "teamMemberId" BIGINT NOT NULL,
    "teamRoleId" BIGINT NOT NULL,

    CONSTRAINT "team_member_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_required_role" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "teamMemberId" BIGINT NOT NULL,
    "requiredRoleId" BIGINT NOT NULL,

    CONSTRAINT "team_required_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_role" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "name" TEXT NOT NULL,
    "teamId" BIGINT NOT NULL,
    "managerId" BIGINT,
    "description" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL,
    "color" "Colors" NOT NULL DEFAULT 'Blue',
    "type" "TeamRoleType",
    "canManageProfile" BOOLEAN NOT NULL DEFAULT false,
    "canViewTreasury" BOOLEAN NOT NULL DEFAULT false,
    "canManageTreasury" BOOLEAN NOT NULL DEFAULT false,
    "canViewJoins" BOOLEAN NOT NULL DEFAULT false,
    "canManageJoins" BOOLEAN NOT NULL DEFAULT false,
    "canManageMemberRoles" BOOLEAN NOT NULL DEFAULT false,
    "canManageRoles" BOOLEAN NOT NULL DEFAULT false,
    "canCreateEvents" BOOLEAN NOT NULL DEFAULT false,
    "canManageEvents" BOOLEAN NOT NULL DEFAULT false,
    "canViewDraftEvents" BOOLEAN NOT NULL DEFAULT false,
    "canCreateActions" BOOLEAN NOT NULL DEFAULT false,
    "canManageActions" BOOLEAN NOT NULL DEFAULT false,
    "canCreateContents" BOOLEAN NOT NULL DEFAULT false,
    "canManageContents" BOOLEAN NOT NULL DEFAULT false,
    "canManageDocuments" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "team_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_payment_method" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "teamId" BIGINT NOT NULL,
    "type" "TeamPaymentMethodType" NOT NULL DEFAULT 'Card',
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "isTreasurerLiable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "team_payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_tag" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "teamId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "team_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_vendor" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "teamId" BIGINT NOT NULL,
    "legalUnitId" BIGINT,
    "brandId" BIGINT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "notes" TEXT,
    "geoapifyAddressId" TEXT,

    CONSTRAINT "team_vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_team_tag" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "createdById" BIGINT,
    "teamTagId" BIGINT NOT NULL,
    "transactionId" BIGINT NOT NULL,

    CONSTRAINT "transaction_team_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_transaction_type" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "teamId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "isIncome" BOOLEAN NOT NULL DEFAULT false,
    "icon" TEXT,

    CONSTRAINT "team_transaction_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankTransaction" (
    "goCardLessTransactionId" TEXT NOT NULL,
    "transactionId" BIGINT,
    "moneyAccountId" BIGINT NOT NULL,
    "referenceId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "wording" TEXT NOT NULL,
    "iban" TEXT,
    "paymentMethod" "PaymentMethod",
    "counterPartyName" TEXT,
    "bookedAt" DATE NOT NULL,
    "payedAt" DATE,
    "currencyExchangeRate" REAL,
    "currencyTarget" "Currency",

    CONSTRAINT "BankTransaction_pkey" PRIMARY KEY ("goCardLessTransactionId")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "approvedAt" TIMESTAMPTZ(0),
    "deletedAt" TIMESTAMPTZ(0),
    "amount" REAL NOT NULL,
    "payedAt" DATE,
    "wording" TEXT NOT NULL,
    "referenceNumber" TEXT,
    "note" TEXT,
    "counterPartyName" TEXT,
    "counterPartyType" "ActorType",
    "counterPartyActorId" BIGINT,
    "counterPartyTeamVendorId" BIGINT,
    "isOnline" BOOLEAN DEFAULT false,
    "website" TEXT,
    "geoapifyAddressId" TEXT,
    "locationName" TEXT,
    "currencyExchangeRate" REAL,
    "currencyTarget" "Currency",
    "teamPaymentMethodId" BIGINT,
    "paymentMethod" "PaymentMethod",
    "teamTransactionTypeId" BIGINT,
    "transactionType" "TransactionType",
    "approvingTeamMemberId" BIGINT,
    "liableTeamMemberId" BIGINT,
    "isLiableTeamMemberUnsure" BOOLEAN NOT NULL DEFAULT false,
    "isAwaitingEvent" BOOLEAN NOT NULL DEFAULT false,
    "teamId" BIGINT NOT NULL,
    "moneyAccountId" BIGINT,
    "eventId" BIGINT,
    "projectId" BIGINT,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "slug" TEXT NOT NULL,
    "passwordHash" TEXT,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "actorId" BIGINT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "points" REAL NOT NULL DEFAULT 0,
    "isOnboardingFinished" BOOLEAN NOT NULL DEFAULT false,
    "isIntroductionFinished" BOOLEAN NOT NULL DEFAULT false,
    "isDarkModePreferred" BOOLEAN NOT NULL DEFAULT false,
    "isDataExportedOnDeactivation" BOOLEAN NOT NULL DEFAULT true,
    "isDataAnonymizedOnDeactivation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "domain" TEXT NOT NULL,
    "pointName" TEXT NOT NULL,
    "isOidcEnabled" BOOLEAN NOT NULL DEFAULT false,
    "oidcName" TEXT NOT NULL DEFAULT '',
    "oidcClientId" TEXT NOT NULL DEFAULT '',
    "oidcClientSecret" TEXT NOT NULL DEFAULT '',
    "oidcDiscoveryUrl" TEXT NOT NULL DEFAULT '',
    "oidcScopes" TEXT NOT NULL DEFAULT '',
    "oidcCallbackUri" TEXT NOT NULL DEFAULT '',
    "eventValidationFormId" BIGINT,
    "actorId" BIGINT NOT NULL,

    CONSTRAINT "tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_member" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "tenant_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_role" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "color" "Colors" NOT NULL DEFAULT 'Blue',
    "type" "TenantRoleType" NOT NULL DEFAULT 'Student',
    "canCreateTeam" BOOLEAN NOT NULL DEFAULT false,
    "canManageTenantLocation" BOOLEAN NOT NULL DEFAULT false,
    "canManageEventApprovalSteps" BOOLEAN NOT NULL DEFAULT false,
    "canManageEventApprovals" BOOLEAN NOT NULL DEFAULT false,
    "canManageTenant" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tenant_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_member_role" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantMemberId" BIGINT NOT NULL,
    "tenantRoleId" BIGINT NOT NULL,

    CONSTRAINT "tenant_member_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "geoapifyId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "AddressType" NOT NULL,
    "amenityType" "AmenityType",
    "latitude" REAL,
    "longitude" REAL,
    "name" TEXT NOT NULL,
    "streetNumber" TEXT,
    "street" TEXT,
    "zip" TEXT,
    "city" TEXT,
    "state" TEXT DEFAULT '',
    "country" "CountryCode" NOT NULL DEFAULT 'FR',

    CONSTRAINT "address_pkey" PRIMARY KEY ("geoapifyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "actor_ical_unique" ON "actor"("ical");

-- CreateIndex
CREATE UNIQUE INDEX "actor_image_image_id_unique" ON "actor_image"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "bank_legal_unit_id_unique" ON "bank"("legalUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "bank_actor_id_unique" ON "bank"("actorId");

-- CreateIndex
CREATE INDEX "tenant_location_tenantLocationClusterId_slug_idx" ON "tenant_location"("tenantLocationClusterId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_location_tenant_scope_id_slug_unique" ON "tenant_location"("tenantLocationClusterId", "slug");

-- CreateIndex
CREATE INDEX "tenant_location_cluster_tenantScopeId_slug_idx" ON "tenant_location_cluster"("tenantScopeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_location_cluster_tenant_scope_id_slug_unique" ON "tenant_location_cluster"("tenantScopeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_slug_unique" ON "event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_join_form_id_unique" ON "event"("joinFormId");

-- CreateIndex
CREATE UNIQUE INDEX "event_event_approval_submission_id_unique" ON "event"("eventApprovalSubmissionId");

-- CreateIndex
CREATE INDEX "event_tenantScopeId_isPrivate_slug_idx" ON "event"("tenantScopeId", "isPrivate", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_tenantScopeId_slug_key" ON "event"("tenantScopeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_image_image_id_unique" ON "event_image"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "event_join_form_submission_id_unique" ON "event_join"("joinFormSubmissionId");

-- CreateIndex
CREATE UNIQUE INDEX "expenseClaim_tranactionId_key" ON "expenseClaim"("tranactionId");

-- CreateIndex
CREATE UNIQUE INDEX "file_upload_url_unique" ON "file_upload"("url");

-- CreateIndex
CREATE UNIQUE INDEX "grant_signature_id_unique" ON "grant"("signatureId");

-- CreateIndex
CREATE UNIQUE INDEX "grant_generated_document_id_unique" ON "grant"("generatedDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "grant_allocate_transaction_id_unique" ON "grant_allocate"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "grant_allocate_signature_id_unique" ON "grant_allocate"("signatureId");

-- CreateIndex
CREATE UNIQUE INDEX "grant_allocate_generated_document_id_unique" ON "grant_allocate"("generatedDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "legal_unit_slug_unique" ON "legal_unit"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "legal_unit_actor_id_unique" ON "legal_unit"("actorId");

-- CreateIndex
CREATE INDEX "legal_unit_slug_idx" ON "legal_unit"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "unique_legal_unit_code" ON "legal_unit_unique_code"("country", "codeType", "code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_mission_slug" ON "mission"("tenantScopeId", "teamId", "slug");

-- CreateIndex
CREATE INDEX "project_tenantScopeId_slug_idx" ON "project"("tenantScopeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "unique_project_slug" ON "project"("teamId", "slug");

-- CreateIndex
CREATE INDEX "tag_tenantScopeId_slug_idx" ON "tag"("tenantScopeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tag_slug" ON "tag"("tenantScopeId", "ownerActorId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "team_join_form_id_unique" ON "team"("joinFormId");

-- CreateIndex
CREATE UNIQUE INDEX "team_actor_id_unique" ON "team"("actorId");

-- CreateIndex
CREATE INDEX "team_tenantScopeId_slug_idx" ON "team"("tenantScopeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "unique_team_slug" ON "team"("tenantScopeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "team_document_file_id_unique" ON "team_document"("fileUploadId");

-- CreateIndex
CREATE UNIQUE INDEX "team_join_form_submission_id_unique" ON "team_join"("joinFormSubmissionId");

-- CreateIndex
CREATE INDEX "team_role_teamId_slug_idx" ON "team_role"("teamId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "unique_team_role_slug" ON "team_role"("teamId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "unique_team_payment_method" ON "team_payment_method"("teamId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "user_slug_unique" ON "user"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_actor_id_unique" ON "user"("actorId");

-- CreateIndex
CREATE INDEX "user_tenantScopeId_slug_idx" ON "user"("tenantScopeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "unique_user_slug" ON "user"("tenantScopeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_domain_unique" ON "tenant"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_oidc_name_unique" ON "tenant"("oidcName");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_event_validation_form_id_unique" ON "tenant"("eventValidationFormId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_actor_id_unique" ON "tenant"("actorId");

-- AddForeignKey
ALTER TABLE "actor" ADD CONSTRAINT "actor_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_image" ADD CONSTRAINT "actor_image_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_image" ADD CONSTRAINT "actor_image_image_id_foreign" FOREIGN KEY ("imageId") REFERENCES "file_upload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_image" ADD CONSTRAINT "actor_image_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_tag" ADD CONSTRAINT "actor_tag_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_tag" ADD CONSTRAINT "actor_tag_tag_id_foreign" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_tag" ADD CONSTRAINT "actor_tag_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role" ADD CONSTRAINT "admin_role_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role" ADD CONSTRAINT "admin_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role" ADD CONSTRAINT "admin_role_tenant_id_foreign" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank" ADD CONSTRAINT "bank_legal_unit_id_foreign" FOREIGN KEY ("legalUnitId") REFERENCES "legal_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank" ADD CONSTRAINT "user_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_requisition" ADD CONSTRAINT "bank_requisition_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_requisition" ADD CONSTRAINT "bank_requisition_bank_id_foreign" FOREIGN KEY ("bankId") REFERENCES "bank"("goCardLessInstitutionId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_requisition" ADD CONSTRAINT "bank_requisition_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_info" ADD CONSTRAINT "bank_info_branch_address_id_foreign" FOREIGN KEY ("branchGeoapifyAddressId") REFERENCES "address"("geoapifyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_info" ADD CONSTRAINT "bank_info_bank_id_foreign" FOREIGN KEY ("bankId") REFERENCES "bank"("goCardLessInstitutionId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_info" ADD CONSTRAINT "bank_info_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_info" ADD CONSTRAINT "bank_info_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "money_account" ADD CONSTRAINT "money_account_parent_id_foreign" FOREIGN KEY ("parentId") REFERENCES "money_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "money_account" ADD CONSTRAINT "money_account_bank_info_id_foreign" FOREIGN KEY ("bankAccountInfoId") REFERENCES "bank_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "money_account" ADD CONSTRAINT "money_account_bank_requisition_agreement_id_foreign" FOREIGN KEY ("goCardLessRequisitionId") REFERENCES "bank_requisition"("goCardLessRequisitionId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "money_account" ADD CONSTRAINT "money_account_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "money_account" ADD CONSTRAINT "money_account_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_location" ADD CONSTRAINT "tenant_location_address_id_foreign" FOREIGN KEY ("geoapifyAddressId") REFERENCES "address"("geoapifyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_location" ADD CONSTRAINT "tenant_location_tenant_location_cluster_id_foreign" FOREIGN KEY ("tenantLocationClusterId") REFERENCES "tenant_location_cluster"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_location" ADD CONSTRAINT "tenant_location_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_location_cluster" ADD CONSTRAINT "tenant_location_cluster_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_location_cluster" ADD CONSTRAINT "tenant_location_cluster_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_address_id_foreign" FOREIGN KEY ("geoapifyAddressId") REFERENCES "address"("geoapifyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_tenant_location_id_foreign" FOREIGN KEY ("tenantLocationId") REFERENCES "tenant_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_location_link_id_foreign" FOREIGN KEY ("locationLinkId") REFERENCES "link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_join_form_id_foreign" FOREIGN KEY ("joinFormId") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_event_approval_submission_id_foreign" FOREIGN KEY ("eventApprovalSubmissionId") REFERENCES "form_submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_next_event_approval_step_id_foreign" FOREIGN KEY ("nextApprovalStepId") REFERENCES "event_approval_step"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link" ADD CONSTRAINT "event_link_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_link" ADD CONSTRAINT "event_link_link_id_foreign" FOREIGN KEY ("linkId") REFERENCES "link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_link" ADD CONSTRAINT "event_link_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_link" ADD CONSTRAINT "actor_tag_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_image" ADD CONSTRAINT "event_image_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_image" ADD CONSTRAINT "actor_image_image_id_foreign" FOREIGN KEY ("imageId") REFERENCES "file_upload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_image" ADD CONSTRAINT "event_image_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval" ADD CONSTRAINT "event_approval_event_approval_step_id_foreign" FOREIGN KEY ("eventApprovalStepId") REFERENCES "event_approval_step"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval" ADD CONSTRAINT "event_approval_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval" ADD CONSTRAINT "event_approval_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval_step" ADD CONSTRAINT "event_approval_step_previous_step_id_foreign" FOREIGN KEY ("previousStepId") REFERENCES "event_approval_step"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval_step" ADD CONSTRAINT "event_approval_step_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval_step" ADD CONSTRAINT "event_approval_step_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval_step_validator" ADD CONSTRAINT "event_approval_step_validator_step_id_foreign" FOREIGN KEY ("stepId") REFERENCES "event_approval_step"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval_step_validator" ADD CONSTRAINT "event_approval_step_validator_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval_step_validator" ADD CONSTRAINT "event_approval_step_validator_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_post_id_foreign" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_form_submission_id_foreign" FOREIGN KEY ("joinFormSubmissionId") REFERENCES "form_submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_joined_by_id_foreign" FOREIGN KEY ("joinedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_participation_processed_by_id_foreign" FOREIGN KEY ("participationProcessedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_processed_by_id_foreign" FOREIGN KEY ("processedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_qr_code_id_foreign" FOREIGN KEY ("qrCodeId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_organize" ADD CONSTRAINT "event_organize_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_organize" ADD CONSTRAINT "event_organize_project_id_foreign" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_organize" ADD CONSTRAINT "event_organize_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_organize" ADD CONSTRAINT "event_organize_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_supervisor" ADD CONSTRAINT "event_supervisor_event_organize_id_foreign" FOREIGN KEY ("eventOrganizeId") REFERENCES "event_organize"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_supervisor" ADD CONSTRAINT "event_supervisor_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_supervisor" ADD CONSTRAINT "event_supervisor_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenseClaim" ADD CONSTRAINT "expense_claim_bank_info_id_foreign" FOREIGN KEY ("bankAccountInfoId") REFERENCES "bank_info"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenseClaim" ADD CONSTRAINT "expense_claim_expense_claim_report_id_foreign" FOREIGN KEY ("expenseClaimReportId") REFERENCES "file_upload"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenseClaim" ADD CONSTRAINT "expense_claim_transaction_id_foreign" FOREIGN KEY ("tranactionId") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenseClaim" ADD CONSTRAINT "expense_claim_processed_by_id_foreign" FOREIGN KEY ("processedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenseClaim" ADD CONSTRAINT "expense_claim_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_form_submission_id_foreign" FOREIGN KEY ("formSubmissionId") REFERENCES "form_submission"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_grant_attachment_id_foreign" FOREIGN KEY ("grantId") REFERENCES "grant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_grant_allocate_attachment_id_foreign" FOREIGN KEY ("grantAllocateId") REFERENCES "grant_allocate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_transaction_attachment_id_foreign" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_followed_actor_id_foreign" FOREIGN KEY ("followedActorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form" ADD CONSTRAINT "form_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form" ADD CONSTRAINT "form_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submission" ADD CONSTRAINT "form_submission_form_id_foreign" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submission" ADD CONSTRAINT "form_submission_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant" ADD CONSTRAINT "grant_generated_document_id_foreign" FOREIGN KEY ("generatedDocumentId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant" ADD CONSTRAINT "grant_received_amount_processed_by_id_foreign" FOREIGN KEY ("receivedAmountProcessedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant" ADD CONSTRAINT "grant_signature_id_foreign" FOREIGN KEY ("signatureId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant" ADD CONSTRAINT "grant_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant" ADD CONSTRAINT "grant_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant" ADD CONSTRAINT "grant_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_allocate" ADD CONSTRAINT "grant_allocate_generated_document_id_foreign" FOREIGN KEY ("generatedDocumentId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_allocate" ADD CONSTRAINT "grant_allocate_signature_id_foreign" FOREIGN KEY ("signatureId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_allocate" ADD CONSTRAINT "grant_allocate_grant_id_foreign" FOREIGN KEY ("grantId") REFERENCES "grant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_allocate" ADD CONSTRAINT "grant_allocate_received_amount_processed_by_id_foreign" FOREIGN KEY ("receivedAmountProcessedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_allocate" ADD CONSTRAINT "grant_allocate_transaction_id_foreign" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_allocate" ADD CONSTRAINT "grant_allocate_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_unit" ADD CONSTRAINT "legal_unit_location_location_id_foreign" FOREIGN KEY ("geoapifyAddressId") REFERENCES "address"("geoapifyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_unit" ADD CONSTRAINT "legal_unit_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_unit" ADD CONSTRAINT "legal_unit_parent_id_foreign" FOREIGN KEY ("parentId") REFERENCES "legal_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_unit" ADD CONSTRAINT "legal_unit_brand_id_foreign" FOREIGN KEY ("brandId") REFERENCES "legal_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_unit" ADD CONSTRAINT "legal_unit_tenant_grant_fund_id_foreign" FOREIGN KEY ("tenantGrantFundId") REFERENCES "tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_unit" ADD CONSTRAINT "legal_unit_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_unit_unique_code" ADD CONSTRAINT "legal_unit_unique_code_legal_unit_id_foreign" FOREIGN KEY ("legalUnitId") REFERENCES "legal_unit"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_tenant_id_foreign" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_transaction_id_foreign" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_event_organize_id_foreign" FOREIGN KEY ("eventOrganizeId") REFERENCES "event_organize"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_team_role_id_foreign" FOREIGN KEY ("teamRoleId") REFERENCES "team_role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_project_id_foreign" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_joined_by_id_foreign" FOREIGN KEY ("joinedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_mission_id_foreign" FOREIGN KEY ("missionId") REFERENCES "mission"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_points_processed_by_id_foreign" FOREIGN KEY ("pointsProcessedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_processed_by_id_foreign" FOREIGN KEY ("processedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_project_id_foreign" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_eventJoinId_fkey" FOREIGN KEY ("eventJoinId") REFERENCES "event_join"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_banner_id_foreign" FOREIGN KEY ("bannerId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_grant_id_foreign" FOREIGN KEY ("grantId") REFERENCES "grant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_supervisor" ADD CONSTRAINT "project_supervisor_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_supervisor" ADD CONSTRAINT "project_supervisor_project_id_foreign" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_supervisor" ADD CONSTRAINT "project_supervisor_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "required_document" ADD CONSTRAINT "required_document_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "required_document" ADD CONSTRAINT "required_document_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "required_role" ADD CONSTRAINT "required_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "required_role" ADD CONSTRAINT "required_role_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social" ADD CONSTRAINT "social_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social" ADD CONSTRAINT "social_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_owner_actor_id_foreign" FOREIGN KEY ("ownerActorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_join_form_id_foreign" FOREIGN KEY ("joinFormId") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_parent_id_foreign" FOREIGN KEY ("parentId") REFERENCES "team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_tenant_grant_fund_id_foreign" FOREIGN KEY ("tenantGrantFundId") REFERENCES "legal_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_cluster" ADD CONSTRAINT "team_activity_location_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_cluster" ADD CONSTRAINT "team_activity_location_tenant_location_id_foreign" FOREIGN KEY ("tenantLocationClusterId") REFERENCES "tenant_location_cluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_cluster" ADD CONSTRAINT "team_activity_location_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_reply_to_id_foreign" FOREIGN KEY ("replyToId") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_post_id_foreign" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_user_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_document" ADD CONSTRAINT "team_document_file_id_foreign" FOREIGN KEY ("fileUploadId") REFERENCES "file_upload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_document" ADD CONSTRAINT "team_document_required_document_id_foreign" FOREIGN KEY ("requiredDocumentId") REFERENCES "required_document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_document" ADD CONSTRAINT "team_document_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_document" ADD CONSTRAINT "team_document_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_history" ADD CONSTRAINT "team_history_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_history" ADD CONSTRAINT "team_history_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_join" ADD CONSTRAINT "team_join_form_submission_id_foreign" FOREIGN KEY ("joinFormSubmissionId") REFERENCES "form_submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_join" ADD CONSTRAINT "team_join_processed_by_id_foreign" FOREIGN KEY ("processedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_join" ADD CONSTRAINT "team_join_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_join" ADD CONSTRAINT "team_join_joined_by_id_foreign" FOREIGN KEY ("joinedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_join" ADD CONSTRAINT "team_join_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member_role" ADD CONSTRAINT "team_member_role_team_member_id_foreign" FOREIGN KEY ("teamMemberId") REFERENCES "team_member"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member_role" ADD CONSTRAINT "team_member_role_team_role_id_foreign" FOREIGN KEY ("teamRoleId") REFERENCES "team_role"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member_role" ADD CONSTRAINT "team_member_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_required_role" ADD CONSTRAINT "team_required_role_team_member_id_foreign" FOREIGN KEY ("teamMemberId") REFERENCES "team_member"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_required_role" ADD CONSTRAINT "team_required_role_required_role_id_foreign" FOREIGN KEY ("requiredRoleId") REFERENCES "required_role"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_required_role" ADD CONSTRAINT "team_required_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_role" ADD CONSTRAINT "team_role_manager_id_foreign" FOREIGN KEY ("managerId") REFERENCES "team_member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_role" ADD CONSTRAINT "team_role_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_role" ADD CONSTRAINT "team_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_payment_method" ADD CONSTRAINT "team_payment_method_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_payment_method" ADD CONSTRAINT "team_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_tag" ADD CONSTRAINT "team_tag_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_tag" ADD CONSTRAINT "team_tag_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_vendor" ADD CONSTRAINT "team_vendor_geoapifyAddressId_fkey" FOREIGN KEY ("geoapifyAddressId") REFERENCES "address"("geoapifyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_vendor" ADD CONSTRAINT "team_vendor_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_vendor" ADD CONSTRAINT "team_vendor_legal_unit_id_foreign" FOREIGN KEY ("legalUnitId") REFERENCES "legal_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_vendor" ADD CONSTRAINT "team_vendor_brand_id_foreign" FOREIGN KEY ("brandId") REFERENCES "legal_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_vendor" ADD CONSTRAINT "team_vendor_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_team_tag" ADD CONSTRAINT "transaction_team_tag_team_tag_id_foreign" FOREIGN KEY ("teamTagId") REFERENCES "team_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_team_tag" ADD CONSTRAINT "transaction_team_tag_transaction_id_foreign" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_team_tag" ADD CONSTRAINT "team_transaction_tag_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_transaction_type" ADD CONSTRAINT "team_transaction_type_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_transaction_type" ADD CONSTRAINT "team_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransaction" ADD CONSTRAINT "bank_transaction_money_account_id_foreign" FOREIGN KEY ("moneyAccountId") REFERENCES "money_account"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransaction" ADD CONSTRAINT "bank_transaction_transaction_id_foreign" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_counter_party_actor_id_foreign" FOREIGN KEY ("counterPartyActorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_counter_party_team_vendore_id_foreign" FOREIGN KEY ("counterPartyTeamVendorId") REFERENCES "team_vendor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_geoapifyAddressId_fkey" FOREIGN KEY ("geoapifyAddressId") REFERENCES "address"("geoapifyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_teamPaymentMethodId_fkey" FOREIGN KEY ("teamPaymentMethodId") REFERENCES "team_payment_method"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_teamTransactionTypeId_fkey" FOREIGN KEY ("teamTransactionTypeId") REFERENCES "team_transaction_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_money_account_id_foreign" FOREIGN KEY ("moneyAccountId") REFERENCES "money_account"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_project_id_foreign" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_approved_by_id_foreign" FOREIGN KEY ("approvingTeamMemberId") REFERENCES "team_member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_responsible_team_member_id_foreign" FOREIGN KEY ("liableTeamMemberId") REFERENCES "team_member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant" ADD CONSTRAINT "tenant_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant" ADD CONSTRAINT "tenant_event_validation_form_id_foreign" FOREIGN KEY ("eventValidationFormId") REFERENCES "form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member" ADD CONSTRAINT "tenant_member_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member" ADD CONSTRAINT "tenant_member_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member" ADD CONSTRAINT "tenant_member_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_role" ADD CONSTRAINT "tenant_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_role" ADD CONSTRAINT "tenant_role_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member_role" ADD CONSTRAINT "tenant_member_role_tenant_member_id_foreign" FOREIGN KEY ("tenantMemberId") REFERENCES "tenant_member"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member_role" ADD CONSTRAINT "tenant_member_role_tenant_role_id_foreign" FOREIGN KEY ("tenantRoleId") REFERENCES "tenant_role"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member_role" ADD CONSTRAINT "tenant_member_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
