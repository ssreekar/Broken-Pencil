var EasyWords= ['Kick', 'Head', 'Sunglasses', 'Mosquito', 'Pinch', 'Chair', 'Jump', 'Elephant', 'Scissors', 'Point', 'Star', 'Tree', 'Airplane', 'Tail', 'Basketball', 'Telephone', 'Mouth', 'Chin', 'Jar', 'Smile', 'Cheek', 'Ear', 'Drum', 'Room', 'Turtle', 'Wings', 'Doll', 'Bird', 'Spider', 'Hopscotch', 'Happy', 'Baby', 'Monkey', 'Pig', 'Crayon', 'Arm', 'Rabbit', 'Book', 'Camera', 'Rock', 'Chicken', 'Robot', 'Drink', 'Balloon', 'Kangaroo', 'Clap', 'Baseball', 'Milk', 'Icecream', 'Circle', 'Sneeze', 'Dog', 'Apple', 'Pen', 'Swing', 'Blinking', 'Door', 'Stop', 'Alligator', 'Dance', 'Skip', 'Football']
var MediumWords= ['Eat', 'Nap', 'Toes', 'Wink', 'Rope', 'Ball', 'Elbow', 'Rollerblade', 'Summer', 'Cow', 'Table', 'tennis', 'Snowball', 'Guitar', 'Alarm', 'Cape', 'Bird', 'Saddle', 'Bike', 'Rain', 'Roof', 'Blind', 'Hoop', 'Violin', 'Frankenstein', 'Stairs', 'Dog', 'String', 'Fetch', 'Cage', 'Mailbox', 'Puppet', 'Penguin', 'Shovel', 'Popcorn', 'Butter', 'Trumpet', 'Haircut', 'Shopping trolley', 'Lipstick', 'Soap', 'Hula', 'Mop', 'Money', 'Food', 'Glue', 'Fang', 'Goldfish', 'Coil', 'Banana', 'Hot', 'See-saw', 'Jellyfish', 'Scarf', 'Tree', 'Seashell', 'Brush', 'Fly', 'Bear', 'Volleyball', 'Peel', 'Newspaper', 'Jog', 'Earthquake', 'Piano', 'Think', 'Whisper', 'Yo-yo', 'Hair', 'Twist', 'Beg']
var HardWords= ['Chalk', 'Story', 'Oar', 'Throne', 'Lawn mower', 'Gingerbread', 'Peck', 'Windmill', 'Bobsled', 'Sand', 'Year', 'Stain', 'Vest', 'Swordfish', 'Pizza', 'Softball', 'Party', 'Wrench', 'Hair', 'Spine', 'Beetle', 'Trip', 'Gym', 'Sip', 'Torch', 'Cowboy', 'Carrot', 'Beggar', 'Lung', 'Basket', 'Flamingo', 'Cuff', 'Dryer', 'Blinds', 'Brain', 'Business', 'Eraser', 'Volcano', 'Whisk', 'Funny', 'Quicksand', 'Trap', 'Sheet', 'Small', 'Mouse', 'Poison', 'Washing', 'Marble', 'Nightmare', 'Vegetable', 'Anger', 'Knot', 'Badge', 'Bubble', 'Cramp', 'Doghouse', 'Mirror', 'Doctor', 'Wig', 'Cloth', 'Shadow', 'Chess', 'Stiff', 'Bathroom', 'Sunburn', 'Cast', 'Wax', 'Scale', 'Honey', 'Giraffe', 'Artist', 'Human', 'Huddle', 'Beast', 'Taxi', 'Ticket', 'Cactus', 'Playground', 'Jar', 'Owl', 'Honk']
var VeryHardWords= ['Journal', 'Advertise', 'Personal', 'Jet', 'lag', 'Flag', 'Teenager', 'Invitation', 'Streamline', 'Pendulum', 'Carpenter', 'Shrink', 'Olive oil', 'Boundary', 'Explore', 'Shaft', 'Music', 'Conversation', 'Application', 'Tomato sauce', 'Pompous', 'Police', 'Island', 'Unemployed', 'Faucet', 'Computer monitor', 'Lifestyle', 'Apathy', 'Mozart', 'Portfolio', 'Level', 'Evolution', 'Train', 'Dismantle', 'Lettuce', 'Crumbs', 'Daughter', 'Feather', 'Mitten', 'Award', 'Sandbox', 'Criticize', 'Silhouette', 'Revenge', 'Love', 'Suit', 'Loyalty', 'Satellite', 'Space-time', 'Tachometer', 'University', 'Sunlight', 'Negotiate', 'Alphabet', 'Hydrant']

var replaceWords = false

const wordContainer = document.getElementById('wordBank')

function getWordButtons(easy, medium, hard, veryHard){
    const easyButton = document.createElement('button')
    const mediumButton = document.createElement('button')
    const hardButton = document.createElement('button')
    const veryHardButton = document.createElement('button')
    easyButton.innerHTML = easy
    mediumButton.innerHTML = medium
    hardButton.innerHTML = hard
    veryHardButton.innerHTML = veryHard
    easyButton.setAttribute('id', 'easy-btn')
    mediumButton.setAttribute('id', 'medium-btn')
    hardButton.setAttribute('id', 'hard-btn')
    veryHardButton.setAttribute('id', 'veryHard-btn')
    wordContainer.append(easyButton)
    wordContainer.append(mediumButton)
    wordContainer.append(hardButton)
    wordContainer.append(veryHardButton)
}

function removeWordButtons(){
    // Removes an element from the document
    var easy = document.getElementById('easy-btn');
    var medium = document.getElementById('medium-btn');
    var hard = document.getElementById('hard-btn');
    var veryHard = document.getElementById('veryHard-btn');
    easy.parentNode.removeChild(easy);
    medium.parentNode.removeChild(medium);
    hard.parentNode.removeChild(hard);
    veryHard.parentNode.removeChild(veryHard);

}

const getWords = document.getElementById('get-words')

getWords.addEventListener('click', ()=>{
    console.log('button clicked')
    var easy = EasyWords[Math.floor(Math.random() * EasyWords.length)]
    var medium = MediumWords[Math.floor(Math.random() * MediumWords.length)]
    var hard = HardWords[Math.floor(Math.random() * HardWords.length)]
    var veryHard = VeryHardWords[Math.floor(Math.random() * VeryHardWords.length)]
    console.log(easy, medium, hard, veryHard)
    if (replaceWords){
        removeWordButtons()
    }
    getWordButtons(easy, medium, hard, veryHard)
    replaceWords = true
})