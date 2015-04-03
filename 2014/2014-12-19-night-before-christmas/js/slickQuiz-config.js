// Setup your quiz text and questions here

// NOTE: pay attention to commas, IE struggles with those bad boys

var quizJSON = {
    "info": {
        "name":    "Who's Reading 'The Night Before Christmas', By Clement Clarke Moore?",
        "main":    "<p>How well do you know St. Louis Public Radio personalities, by voice? Choose who's reciting each line of this popular Christmas poem.</p>",
        "results": "<p>Thanks for taking our quiz! Would you like to hear the poem again? Click below to hear the whole thing. And don't forget to share with your friends to see how well they do.</p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/full.mp3\" data-start=\"0\" data-end=\"246000\">Listen to the full version</span></p>"
    },
    "questions": [
        { 
            "q": "<p>'Twas the night before Christmas, when all through the house<br/>Not a creature was stirring, not even a mouse;<br/>The stockings were hung by the chimney with care,<br/>In hopes that St. Nicholas soon would be there;</p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/1.mp3\" data-start=\"0\" data-end=\"14000\">listen</span></p>",
            "a": [
                {"option": "Mike Schrand",      "correct": false},
                {"option": "Jason Rosenbaum",     "correct": false},
                {"option": "Don Marsh",      "correct": true},
                {"option": "Tim Lloyd",     "correct": false} // no comma here
            ],
            "correct": "<p><span>That's right!</span> It was Don Marsh.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/don.jpg\">",
            "incorrect": "<p><span>Incorrect.</span> It was Don Marsh.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/don.jpg\"></p> " // no comma here
        },
        { 
            "q": "<p>The children were nestled all snug in their beds;<br\>While visions of sugar-plums danced in their heads;<br\>And mamma in her \'kerchief, and I in my cap,<br\>Had just settled our brains for a long winter\'s nap,</p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/2.mp3\" data-start=\"0\" data-end=\"14000\">listen</span></p>",
            "a": [
                {"option": "Steve Potter",      "correct": false},
                {"option": "Tim Lloyd",     "correct": true},
                {"option": "Dale Singer",      "correct": false},
                {"option": "Chris McDaniel",     "correct": false} // no comma here
            ],
            "correct": "<p><span>That's right!</span> It was Tim Lloyd.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/tim.jpg\">",
            "incorrect": "<p><span>Incorrect.</span> It was Tim Lloyd.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/tim.jpg\"></p> " // no comma here
        },
        { 
            "q": "<p>When out on the lawn there arose such a clatter,<br/>I sprang from my bed to see what was the matter.<br/>Away to the window I flew like a flash,<br/>Tore open the shutters and threw up the sash.<br/></p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/3.mp3\" data-start=\"0\" data-end=\"12000\">listen</span></p>",
            "a": [
                {"option": "Jo Mannies",      "correct": false},
                {"option": "Maria Altman",     "correct": false},
                {"option": "Camille Phillips",      "correct": false},
                {"option": "Rachel Lippmann",     "correct": true} // no comma here
            ],
            "correct": "<p><span>That's right!</span> It was Rachel Lippmann.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/rachel.jpg\">",
            "incorrect": "<p><span>Incorrect.</span> It was Rachel Lippmann.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/rachel.jpg\"></p> " // no comma here
        },
        { 
            "q": "<p>The moon on the breast of the new-fallen snow,<br/>Gave a lustre of midday to objects below,<br/>When what to my wondering eyes did appear,<br/>But a miniature sleigh and eight tiny rein-deer,<br/></p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/4.mp3\" data-start=\"0\" data-end=\"15000\">listen</span></p>",
            "a": [
                {"option": "Wayne Pratt",      "correct": true},
                {"option": "Greg Munteanu",     "correct": false},
                {"option": "Willis Ryder Arnold",      "correct": false},
                {"option": "Jim Howard",     "correct": false} // no comma here
            ],
            "correct": "<p><span>That's right!</span> It was Wayne Pratt.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/wayne.jpg\">",
            "incorrect": "<p><span>Incorrect.</span> It was Wayne Pratt.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/wayne.jpg\"></p> " // no comma here
        },
        { 
            "q": "<p>With a little old driver so lively and quick,<br/>I knew in a moment he must be St. Nick.<br/>More rapid than eagles his coursers they came,<br/>And he whistled, and shouted, and called them by name:<br/></p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/5.mp3\" data-start=\"0\" data-end=\"14000\">listen</span></p>",
            "a": [
                {"option": "Gerry Rohde",      "correct": false},
                {"option": "Jason Rosenbaum",     "correct": false},
                {"option": "Chris McDaniel",      "correct": true},
                {"option": "Bill Raack",     "correct": false} // no comma here
            ],
            "correct": "<p><span>That's right!</span> It was Chris McDaniel.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/chris.jpg\">",
            "incorrect": "<p><span>Incorrect.</span> It was Chris McDaniel.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/chris.jpg\"></p> " // no comma here
        },
        { 
            "q": "<p>\"Now, Dasher! now, Dancer! now Prancer and Vixen!<br/>On, Comet! on, Cupid! on, Donner and Blitzen!<br/>To the top of the porch! to the top of the wall!<br/>Now dash away! dash away! dash away all!\"</p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/6.mp3\" data-start=\"0\" data-end=\"16000\">listen</span></p>",
            "a": [
                {"option": "Nancy Fowler",      "correct": false},
                {"option": "Veronique LaCapra",     "correct": true},
                {"option": "Geri Mitchell",      "correct": false},
                {"option": "Stephanie Lecci",     "correct": false} // no comma here
            ],
            "correct": "<p><span>That's right!</span> It was Veronique LaCapra.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/veronique.jpg\">",
            "incorrect": "<p><span>Incorrect.</span> It was Veronique LaCapra.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/veronique.jpg\"></p> " // no comma here
        },
        { 
            "q": "<p>As leaves that before the wild hurricane fly,<br/>When they meet with an obstacle, mount to the sky;<br/>So up to the housetop the coursers they flew<br/>With the sleigh full of toys, and St. Nicholas too—<br/></p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/7.mp3\" data-start=\"0\" data-end=\"15000\">listen</span></p>",
            "a": [
                {"option": "Bill Raack",      "correct": true},
                {"option": "Don Marsh",     "correct": false},
                {"option": "Joseph Leahy",      "correct": false},
                {"option": "Tim Lloyd",     "correct": false} // no comma here
            ],
            "correct": "<p><span>That's right!</span> It was Bill Raack.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/bill.jpg\">",
            "incorrect": "<p><span>Incorrect.</span> It was Bill Raack.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/bill.jpg\"></p> " // no comma here
        },
        { 
            "q": "<p>And then, in a twinkling, I heard on the roof<br/>The prancing and pawing of each little hoof.<br/>As I drew in my head, and was turning around,<br/>Down the chimney St. Nicholas came with a bound.<br/></p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/8.mp3\" data-start=\"0\" data-end=\"15000\">listen</span></p>",
            "a": [
                {"option": "Jim Howard",      "correct": false},
                {"option": "Joseph Leahy",     "correct": true},
                {"option": "Greg Munteanu",      "correct": false},
                {"option": "Wayne Pratt",     "correct": false} // no comma here
            ],
            "correct": "<p><span>That's right!</span> It was Joseph Leahy.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/joseph.jpg\">",
            "incorrect": "<p><span>Incorrect.</span> It was Joseph Leahy.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/joseph.jpg\"></p> " // no comma here
        },
        { 
            "q": "<p>He was dressed all in fur, from his head to his foot,<br/>And his clothes were all tarnished with ashes and soot;<br/>A bundle of toys he had flung on his back,<br/>And he looked like a pedler just opening his pack.<br/></p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/9.mp3\" data-start=\"0\" data-end=\"13000\">listen</span></p>",
            "a": [
                {"option": "Shula Neuman",      "correct": false},
                {"option": "Jo Mannies",     "correct": false},
                {"option": "Durrie Bouscaren",      "correct": false},
                {"option": "Maria Altman",     "correct": true} // no comma here
            ],
            "correct": "<p><span>That's right!</span> It was Maria Altman.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/maria.jpg\">",
            "incorrect": "<p><span>Incorrect.</span> It was Maria Altman.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/maria.jpg\"></p> " // no comma here
        },
        { 
            "q": "<p>His eyes—how they twinkled! his dimples, how merry!<br/>His cheeks were like roses, his nose like a cherry!<br/>His droll little mouth was drawn up like a bow,<br/>And the beard on his chin was as white as the snow;<br/></p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/10.mp3\" data-start=\"0\" data-end=\"15000\">listen</span></p>",
            "a": [
                {"option": "Don Marsh",      "correct": false},
                {"option": "Steve Potter",     "correct": true},
                {"option": "Gerry Rohde",      "correct": false},
                {"option": "Tim Lloyd",     "correct": false} // no comma here
            ],
            "correct": "<p><span>That's right!</span> It was Steve Potter.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/steve.jpg\">",
            "incorrect": "<p><span>Incorrect.</span> It was Steve Potter.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/steve.jpg\"></p> " // no comma here
        },
        { 
            "q": "<p>The stump of a pipe he held tight in his teeth,<br/>And the smoke, it encircled his head like a wreath;<br/>He had a broad face and a little round belly<br/>That shook when he laughed, like a bowl full of jelly.<br/></p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/11.mp3\" data-start=\"0\" data-end=\"14000\">listen</span></p>",
            "a": [
                {"option": "Maria Altman",      "correct": false},
                {"option": "Shula Neuman",     "correct": true},
                {"option": "Nancy Fowler",      "correct": false},
                {"option": "Camille Phillips",     "correct": false} // no comma here
            ],
            "correct": "<p><span>That's right!</span> It was Shula Neuman.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/shula.jpg\">",
            "incorrect": "<p><span>Incorrect.</span> It was Shula Neuman.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/shula.jpg\"></p> " // no comma here
        },
        { 
            "q": "<p>He was chubby and plump, a right jolly old elf,<br/>And I laughed when I saw him, in spite of myself;<br/>A wink of his eye and a twist of his head<br/>Soon gave me to know I had nothing to dread;<br/></p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/12.mp3\" data-start=\"0\" data-end=\"15000\">listen</span></p>",
            "a": [
                {"option": "Joseph Leahy",      "correct": false},
                {"option": "Bill Raack",     "correct": false},
                {"option": "Dale Singer",      "correct": false},
                {"option": "Greg Munteanu",     "correct": true} // no comma here
            ],
            "correct": "<p><span>That's right!</span> It was Greg Munteanu.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/greg.jpg\">",
            "incorrect": "<p><span>Incorrect.</span> It was Greg Munteanu.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/greg.jpg\"></p> " // no comma here
        },
        { 
            "q": "<p>He spoke not a word, but went straight to his work,<br/>And filled all the stockings; then turned with a jerk,<br/>And laying his finger aside of his nose,<br/>And giving a nod, up the chimney he rose;<br/></p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/13.mp3\" data-start=\"0\" data-end=\"15000\">listen</span></p>",
            "a": [
                {"option": "Jim Howard",      "correct": false},
                {"option": "Gerry Rohde",     "correct": true},
                {"option": "Jason Rosenbaum",      "correct": false},
                {"option": "Mike Schrand",     "correct": false} // no comma here
            ],
            "correct": "<p><span>That's right!</span> It was Gerry Rhode.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/gerry.jpg\">",
            "incorrect": "<p><span>Incorrect.</span> It was Gerry Rhode.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/gerry.jpg\"></p> " // no comma here
        },
        { 
            "q": "<p>He sprang to his sleigh, to his team gave a whistle,<br/>And away they all flew like the down of a thistle.<br/>But I heard him exclaim, ere he drove out of sight—<br/>\“Happy Christmas to all, and to all a good night!\”<br/></p><p><span class=\"soundcite\" data-url=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/14.mp3\" data-start=\"0\" data-end=\"21000\">listen</span></p>",
            "a": [
                {"option": "Stephanie Lecci",      "correct": false},
                {"option": "Geri Mitchell",     "correct": true},
                {"option": "Durrie Bouscaren",      "correct": false},
                {"option": "Rachel Lippmann",     "correct": false} // no comma here
            ],
            "correct": "<p><span>That's right!</span> It was Geri Mitchell.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/geri.jpg\">",
            "incorrect": "<p><span>Incorrect.</span> It was Geri Mitchell.</p><img src=\"http://apps.stlpublicradio.org/dailygraphics/graphics/20141219-night-before-christmas/assets/geri.jpg\"></p> " // no comma here
        }
    ]
};
