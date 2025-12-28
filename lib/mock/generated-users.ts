/* AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
 * Run: npm run sync:data
 */
export type GeneratedStockRow = {
  stockNumber: string;
  price: number;
  royaltyPercent: number;
  totalStock: number;
  soldStock: number;
  earnings: number;
  settledAmount: number;
  leftRoyalty: number;
};

export type GeneratedBook = {
  id: string;
  title: string;
  isbn: string;
  description: string;
  images: string[];
  stock: GeneratedStockRow[];
};

export type GeneratedUser = {
  username: string;
  email: string;
  passwordHash: string;
  books: GeneratedBook[];
};

export const generatedUsers: GeneratedUser[] = [
  {
    "username": "Faizan Khan",
    "email": "faizankhan@gmail.com",
    "passwordHash": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
    "books": [
      {
        "id": "faizan-khan-mokhla",
        "title": "Mokhla",
        "isbn": "978-81-990678-0-6",
        "description": "Faizan Khan is from Delhi, though he was born at his maternal home in Shahjahanpur. He is both an actor and a writer. In 2013, he joined a theatre group, where his journey as a writer began alongside acting. His first poetry collection, “Rangon Mein Berang”, was published in 2017 and made it to the Dainik Jagran Nielsen Bestseller List three times. In 2021, his first short story collection, “Bandar”, was also published. One of the stories from this collection, “Bandar”, was successfully adapted into a play in Shahjahanpur in 2017, where it won him the award for Best Script. In 2018, he moved to Mumbai, and since then, his notable works include films like IB71, Batla House, and Binnu Ka Sapna.",
        "images": [
          "/book-cover-1.svg",
          "/book-cover-2.svg"
        ],
        "stock": [
          {
            "stockNumber": "1st ",
            "price": 225,
            "royaltyPercent": 10,
            "totalStock": 1000,
            "soldStock": 64,
            "earnings": 21060,
            "settledAmount": 0,
            "leftRoyalty": 21060
          },
          {
            "stockNumber": "2nd",
            "price": 225,
            "royaltyPercent": 10,
            "totalStock": 1000,
            "soldStock": 150,
            "earnings": 19125,
            "settledAmount": 0,
            "leftRoyalty": 19125
          },
          {
            "stockNumber": "3rd",
            "price": 249,
            "royaltyPercent": 10,
            "totalStock": 1000,
            "soldStock": 750,
            "earnings": 6225.000000000001,
            "settledAmount": 0,
            "leftRoyalty": 6225.000000000001
          },
          {
            "stockNumber": "4th",
            "price": 249,
            "royaltyPercent": 10,
            "totalStock": 1000,
            "soldStock": 750,
            "earnings": 6225.000000000001,
            "settledAmount": 0,
            "leftRoyalty": 6225.000000000001
          }
        ]
      }
    ]
  },
  {
    "username": "Reetey ",
    "email": "reetay@gmail.com",
    "passwordHash": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
    "books": [
      {
        "id": "reetey-jo-dekha-wahi-kah-diya",
        "title": "Jo Dekha Wahi Kah Diya",
        "isbn": "978-81-990678-8-2",
        "description": "The search for peace in words, and words in life, keeps Reetey close to literature. His journey began with reading poems from his father’s diary, which gradually turned into writing and publishing poetry during his college days. His first poetry collection “Aatmakriti” (2014) and the second, “Adhura Aasman” (2016), created a dedicated readership across campuses and social media. After nearly eleven years, his third poetry collection “Jo Dekha Wahi Keh Diya” emerges from the same creative soil, nurtured by the experiences and events surrounding him. He is also active on social media under the name #reetey.",
        "images": [
          "/book-cover-1.svg",
          "/book-cover-2.svg"
        ],
        "stock": [
          {
            "stockNumber": "1st ",
            "price": 225,
            "royaltyPercent": 12,
            "totalStock": 1000,
            "soldStock": 5,
            "earnings": 26865,
            "settledAmount": 0,
            "leftRoyalty": 26865
          },
          {
            "stockNumber": "2nd",
            "price": 225,
            "royaltyPercent": 12,
            "totalStock": 1000,
            "soldStock": 73,
            "earnings": 25029,
            "settledAmount": 0,
            "leftRoyalty": 25029
          },
          {
            "stockNumber": "3rd",
            "price": 249,
            "royaltyPercent": 12,
            "totalStock": 1000,
            "soldStock": 924,
            "earnings": 2270.88,
            "settledAmount": 0,
            "leftRoyalty": 2270.88
          }
        ]
      }
    ]
  },
  {
    "username": "Ipsit Pandey Shivani",
    "email": "Ipsit@gmail.com",
    "passwordHash": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
    "books": [
      {
        "id": "ipsit-pandey-shivani-bougainvillea-ka-dukh",
        "title": "Bougainvillea Ka Dukh",
        "isbn": "978-81-990678-6-8",
        "description": "Ipsit Pandey, who grew up in the Azamgarh district of Uttar Pradesh, was drawn to writing from an early age by her deep sensitivity toward words and her passion for literature. Although a student of Agricultural Science, her heart has always belonged to a writer. This love for literature gave her the strength to keep writing, and along this journey, she was honored with the Azamgarh Hari Audh Samman, which further strengthened her resolve to move forward. Her debut poetry collection, “Bougainvillea ka Dukh” (The Sorrow of Bougainvillea), now comes before readers—an intimate expression where emotions, memories, and experiences seamlessly take the shape of words.",
        "images": [
          "/book-cover-1.svg",
          "/book-cover-2.svg"
        ],
        "stock": [
          {
            "stockNumber": "1st ",
            "price": 225,
            "royaltyPercent": 10,
            "totalStock": 1000,
            "soldStock": 111,
            "earnings": 20002.5,
            "settledAmount": 0,
            "leftRoyalty": 20002.5
          },
          {
            "stockNumber": "2nd",
            "price": 225,
            "royaltyPercent": 10,
            "totalStock": 1000,
            "soldStock": 95,
            "earnings": 20362.5,
            "settledAmount": 0,
            "leftRoyalty": 20362.5
          },
          {
            "stockNumber": "3rd",
            "price": 249,
            "royaltyPercent": 10,
            "totalStock": 1000,
            "soldStock": 816,
            "earnings": 4581.6,
            "settledAmount": 0,
            "leftRoyalty": 4581.6
          }
        ]
      }
    ]
  },
  {
    "username": "Harminder Chahal",
    "email": "Harminder@gmail.com",
    "passwordHash": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
    "books": [
      {
        "id": "harminder-chahal-the-power-of-15-minutes",
        "title": "The Power Of 15 Minutes",
        "isbn": "978-81-993339-8-7",
        "description": "\"Did you know that the power to transform your life is hidden within the first 15 minutes of your day? This book is dedicated to that very overlooked power. It isn't a long, exhausting routine, but a simple 15-minute practice based on 50 years of experience that grants you mental clarity, peace, and confidence. Through this book, you will learn to master a mobile-free morning, 'mind clean-up' techniques, and the three magic questions of self-reflection. If you are looking for true and deep change in your life, choose this guide today and stand out from the crowd with a difference of just 15 minutes.\"",
        "images": [
          "/book-cover-1.svg",
          "/book-cover-2.svg"
        ],
        "stock": [
          {
            "stockNumber": "1st ",
            "price": 299,
            "royaltyPercent": 12,
            "totalStock": 1000,
            "soldStock": 10,
            "earnings": 35521.2,
            "settledAmount": 0,
            "leftRoyalty": 35521.2
          },
          {
            "stockNumber": "2nd",
            "price": 299,
            "royaltyPercent": 12,
            "totalStock": 1000,
            "soldStock": 68,
            "earnings": 33440.159999999996,
            "settledAmount": 0,
            "leftRoyalty": 33440.159999999996
          },
          {
            "stockNumber": "3rd",
            "price": 299,
            "royaltyPercent": 12,
            "totalStock": 1000,
            "soldStock": 934,
            "earnings": 2368.08,
            "settledAmount": 0,
            "leftRoyalty": 2368.08
          },
          {
            "stockNumber": "4th",
            "price": 299,
            "royaltyPercent": 12,
            "totalStock": 1000,
            "soldStock": 934,
            "earnings": 2368.08,
            "settledAmount": 0,
            "leftRoyalty": 2368.08
          }
        ]
      }
    ]
  },
  {
    "username": "Auro",
    "email": "auro@gmail.com",
    "passwordHash": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
    "books": [
      {
        "id": "auro-romeo-juliet-and-smartcities",
        "title": "Romeo-Juliet and Smartcities",
        "isbn": "978-81-990678-2-0",
        "description": "Swapnil Jain, the writer of the popular audio shows Insta Millionaire, The Return of Tiger, and the novel Balliyaan - Theek Prem Ke Beech (Poles - Right in the Middle of Love), was born in Bhawani Mandi, a small town in Rajasthan. He completed his schooling there, and it was there that his quest for art and related institutions began. Since Bhawani Mandi was primarily a commercial town and lacked these opportunities, he moved to Jaipur. He began his graduation in Journalism and Mass Communication, and simultaneously, his journey in theatre began. Starting with acting on stage, he later ventured into writing and directing plays as well. He has been associated with over thirty plays in various capacities. Several of Swapnil's written plays have been performed in different parts of India. After completing his graduation, he worked for a long time in the field of theatre in education with the Azim Premji Foundation, under the guidance of Abhishek Goswami. Swapnil is currently active as a Creative Producer in Mumbai, along with writing in various other genres.",
        "images": [
          "/book-cover-1.svg",
          "/book-cover-2.svg"
        ],
        "stock": [
          {
            "stockNumber": "1st ",
            "price": 249,
            "royaltyPercent": 0,
            "totalStock": 1000,
            "soldStock": 98,
            "earnings": 22459.800000000003,
            "settledAmount": 0,
            "leftRoyalty": 22459.800000000003
          }
        ]
      },
      {
        "id": "auro-romeo",
        "title": "Romeo",
        "isbn": "978-81-990678-2-0",
        "description": "Swapnil Jain, the writer of the popular audio shows Insta Millionaire, The Return of Tiger, and the novel Balliyaan - Theek Prem Ke Beech (Poles - Right in the Middle of Love), was born in Bhawani Mandi, a small town in Rajasthan. He completed his schooling there, and it was there that his quest for art and related institutions began. Since Bhawani Mandi was primarily a commercial town and lacked these opportunities, he moved to Jaipur. He began his graduation in Journalism and Mass Communication, and simultaneously, his journey in theatre began. Starting with acting on stage, he later ventured into writing and directing plays as well. He has been associated with over thirty plays in various capacities. Several of Swapnil's written plays have been performed in different parts of India. After completing his graduation, he worked for a long time in the field of theatre in education with the Azim Premji Foundation, under the guidance of Abhishek Goswami. Swapnil is currently active as a Creative Producer in Mumbai, along with writing in various other genres.",
        "images": [
          "/book-cover-1.svg",
          "/book-cover-2.svg"
        ],
        "stock": [
          {
            "stockNumber": "1st ",
            "price": 249,
            "royaltyPercent": 0,
            "totalStock": 1000,
            "soldStock": 98,
            "earnings": 22459.800000000003,
            "settledAmount": 0,
            "leftRoyalty": 22459.800000000003
          }
        ]
      },
      {
        "id": "auro-romeo1",
        "title": "Romeo1",
        "isbn": "978-81-990678-2-0",
        "description": "Swapnil Jain, the writer of the popular audio shows Insta Millionaire, The Return of Tiger, and the novel Balliyaan - Theek Prem Ke Beech (Poles - Right in the Middle of Love), was born in Bhawani Mandi, a small town in Rajasthan. He completed his schooling there, and it was there that his quest for art and related institutions began. Since Bhawani Mandi was primarily a commercial town and lacked these opportunities, he moved to Jaipur. He began his graduation in Journalism and Mass Communication, and simultaneously, his journey in theatre began. Starting with acting on stage, he later ventured into writing and directing plays as well. He has been associated with over thirty plays in various capacities. Several of Swapnil's written plays have been performed in different parts of India. After completing his graduation, he worked for a long time in the field of theatre in education with the Azim Premji Foundation, under the guidance of Abhishek Goswami. Swapnil is currently active as a Creative Producer in Mumbai, along with writing in various other genres.",
        "images": [
          "/book-cover-1.svg",
          "/book-cover-2.svg"
        ],
        "stock": [
          {
            "stockNumber": "1st ",
            "price": 249,
            "royaltyPercent": 0,
            "totalStock": 1000,
            "soldStock": 98,
            "earnings": 22459.800000000003,
            "settledAmount": 0,
            "leftRoyalty": 22459.800000000003
          }
        ]
      }
    ]
  },
  {
    "username": "Swapnil Jain ",
    "email": "Swaonil@gmail.com",
    "passwordHash": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
    "books": [
      {
        "id": "swapnil-jain-romeo-juliet-and-smartcities",
        "title": "Romeo-Juliet and Smartcities",
        "isbn": "978-81-990678-2-0",
        "description": "Swapnil Jain, the writer of the popular audio shows Insta Millionaire, The Return of Tiger, and the novel Balliyaan - Theek Prem Ke Beech (Poles - Right in the Middle of Love), was born in Bhawani Mandi, a small town in Rajasthan. He completed his schooling there, and it was there that his quest for art and related institutions began. Since Bhawani Mandi was primarily a commercial town and lacked these opportunities, he moved to Jaipur. He began his graduation in Journalism and Mass Communication, and simultaneously, his journey in theatre began. Starting with acting on stage, he later ventured into writing and directing plays as well. He has been associated with over thirty plays in various capacities. Several of Swapnil's written plays have been performed in different parts of India. After completing his graduation, he worked for a long time in the field of theatre in education with the Azim Premji Foundation, under the guidance of Abhishek Goswami. Swapnil is currently active as a Creative Producer in Mumbai, along with writing in various other genres.",
        "images": [
          "/book-cover-1.svg",
          "/book-cover-2.svg"
        ],
        "stock": [
          {
            "stockNumber": "1st ",
            "price": 249,
            "royaltyPercent": 10,
            "totalStock": 1000,
            "soldStock": 98,
            "earnings": 22459.800000000003,
            "settledAmount": 0,
            "leftRoyalty": 22459.800000000003
          },
          {
            "stockNumber": "2nd",
            "price": 249,
            "royaltyPercent": 10,
            "totalStock": 1000,
            "soldStock": 125,
            "earnings": 21787.500000000004,
            "settledAmount": 0,
            "leftRoyalty": 21787.500000000004
          },
          {
            "stockNumber": "3rd",
            "price": 275,
            "royaltyPercent": 10,
            "totalStock": 1000,
            "soldStock": 800,
            "earnings": 5500,
            "settledAmount": 0,
            "leftRoyalty": 5500
          }
        ]
      }
    ]
  },
  {
    "username": "Ambuj Anand",
    "email": "ambuj@gmail.com",
    "passwordHash": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
    "books": [
      {
        "id": "ambuj-anand-mazdoor-ki-diary-ka-akhiri-panna",
        "title": "Mazdoor Ki Diary Ka Akhiri Panna",
        "isbn": "978-81-993339-4-9",
        "description": "In this diary, fragments of stories appear, much like the scattered pieces, small fragments, and scenes spread all around life. Ambuj sketches a scene in his diary and leaves it incomplete—like an unfinished landscape. There is no very concrete thread, which one could call a beginning or an end, visible at the start or end of these scenes. It begins like an abstract painting and ends just like one, as if he has no interest in elaboration or a conclusion. The incompleteness of this diary is its end and its beauty. There are possibilities for poems and stories in Ambuj's writing—I do not know if he writes poetry or stories, but interest should be taken in this book because it does not lose its existence of being a 'diary'. The diary beautifully speaks its mind—in its own way, on its own terms; without caring whether it will be understood or not. This diary does not reveal the privacy of a bedroom like traditional diary writing—it simply speaks its mind, meticulously, honestly, saying everything—while reveling in its own beauty. It says everything while stretching its linguistic muscles—the one who understands will feel how much has been said here, and the one who does not understand will say—how much is left unsaid. How much remained incomplete. — Naveen Rangiyal",
        "images": [
          "/book-cover-1.svg",
          "/book-cover-2.svg"
        ],
        "stock": [
          {
            "stockNumber": "1st ",
            "price": 275,
            "royaltyPercent": 10,
            "totalStock": 1000,
            "soldStock": 20,
            "earnings": 26950,
            "settledAmount": 0,
            "leftRoyalty": 26950
          },
          {
            "stockNumber": "2nd",
            "price": 275,
            "royaltyPercent": 10,
            "totalStock": 1000,
            "soldStock": 95,
            "earnings": 24887.5,
            "settledAmount": 0,
            "leftRoyalty": 24887.5
          },
          {
            "stockNumber": "3rd",
            "price": 299,
            "royaltyPercent": 10,
            "totalStock": 1000,
            "soldStock": 900,
            "earnings": 2990,
            "settledAmount": 0,
            "leftRoyalty": 2990
          }
        ]
      }
    ]
  },
  {
    "username": "Test",
    "email": "test@gmail.com",
    "passwordHash": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
    "books": [
      {
        "id": "test-romeo-test",
        "title": "Romeo-Test",
        "isbn": "978-81-990678-2-0",
        "description": "Swapnil Jain, the writer of the popular audio shows Insta Millionaire, The Return of Tiger, and the novel Balliyaan - Theek Prem Ke Beech (Poles - Right in the Middle of Love), was born in Bhawani Mandi, a small town in Rajasthan. He completed his schooling there, and it was there that his quest for art and related institutions began. Since Bhawani Mandi was primarily a commercial town and lacked these opportunities, he moved to Jaipur. He began his graduation in Journalism and Mass Communication, and simultaneously, his journey in theatre began. Starting with acting on stage, he later ventured into writing and directing plays as well. He has been associated with over thirty plays in various capacities. Several of Swapnil's written plays have been performed in different parts of India. After completing his graduation, he worked for a long time in the field of theatre in education with the Azim Premji Foundation, under the guidance of Abhishek Goswami. Swapnil is currently active as a Creative Producer in Mumbai, along with writing in various other genres.",
        "images": [
          "/book-cover-1.svg",
          "/book-cover-2.svg"
        ],
        "stock": [
          {
            "stockNumber": "1st ",
            "price": 249,
            "royaltyPercent": 0,
            "totalStock": 1000,
            "soldStock": 98,
            "earnings": 22459.800000000003,
            "settledAmount": 0,
            "leftRoyalty": 22459.800000000003
          }
        ]
      }
    ]
  }
];
