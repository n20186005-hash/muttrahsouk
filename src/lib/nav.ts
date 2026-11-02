// مجموعات أدلة الموقع: تُستهلك في ترويسة الموقع وتذييله لتوحيد الربط الداخلي.
export interface NavGroup {
  title: string;
  links: [string, string][];
}

export const navGroups: NavGroup[] = [
  {
    title: 'الزيارة والوصول',
    links: [
      ['/visit/location/', 'الموقع والخريطة'],
      ['/visit/opening-hours/', 'أوقات العمل'],
      ['/visit/parking/', 'المواقف'],
      ['/visit/entrances/', 'المداخل والبوابات'],
      ['/visit/bus/', 'الوصول بالحافلة'],
      ['/visit/from-airport/', 'من مطار مسقط'],
      ['/visit/best-time/', 'أفضل وقت للزيارة'],
      ['/visit/cruise-port/', 'من ميناء السلطان قابوس'],
      ['/visit/accessible-route/', 'زيارة ميسّرة'],
      ['/visit/family-practical/', 'الزيارة مع الأطفال'],
      ['/visit/ramadan/', 'السوق في رمضان'],
      ['/visit/hot-weather/', 'الزيارة في الصيف'],
    ],
  },
  {
    title: 'السوق وثقافته',
    links: [
      ['/souq/history/', 'تاريخ سوق مطرح'],
      ['/souq/al-dhalam/', 'لماذا سوق الظلام؟'],
      ['/souq/what-to-buy/', 'ماذا تشتري'],
      ['/souq/frankincense/', 'اللبان والبخور'],
      ['/souq/silver-khanjar/', 'الفضة والخناجر'],
      ['/souq/perfume-spices/', 'العطور والتوابل'],
      ['/souq/bargaining-payment/', 'المساومة والدفع'],
      ['/souq/wholesale-vs-main/', 'سوق الجملة'],
      ['/souq/architecture/', 'العمارة التقليدية'],
      ['/souq/textiles-clothing/', 'الأقمشة والملابس'],
      ['/souq/photography-etiquette/', 'التصوير والآداب'],
    ],
  },
  {
    title: 'المطاعم والمقاهي',
    links: [
      ['/food/nearby-restaurants/', 'مطاعم قريبة من السوق'],
      ['/food/omani-food/', 'الأكلات العُمانية'],
      ['/food/cafes/', 'مقاهي كورنيش مطرح'],
      ['/food/seafood/', 'مطاعم السمك'],
      ['/food/quick-drinks/', 'الشاي والكرك والوجبات الخفيفة'],
    ],
  },
  {
    title: 'حول السوق',
    links: [
      ['/around/corniche/', 'كورنيش مطرح'],
      ['/around/fort/', 'قلعة مطرح'],
      ['/around/fish-market/', 'سوق السمك'],
      ['/around/riyam-park/', 'حديقة ريام'],
      ['/around/place-people-museum/', 'متحف المكان والناس'],
      ['/around/old-muscat/', 'مسقط القديمة'],
    ],
  },
  {
    title: 'برامج الزيارة والإقامة',
    links: [
      ['/itineraries/one-hour/', 'زيارة في ساعة'],
      ['/itineraries/2-hour-walk/', 'جولة مشي ساعتين'],
      ['/itineraries/half-day/', 'برنامج نصف يوم'],
      ['/itineraries/family/', 'مسار عائلي'],
      ['/itineraries/sunset-photo/', 'الغروب والتصوير'],
      ['/stay/nearby/', 'فنادق قريبة'],
    ],
  },
];
