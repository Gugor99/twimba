import {importTweetsData} from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
const tweetsData = getLocalIfPossible()
const tweetBtn = document.getElementById('tweet-btn')

function getLocalIfPossible(){
    if (localStorage.getItem("tweetsData")){
        return JSON.parse(localStorage.getItem("tweetsData"))
    } else {
        return importTweetsData
    }
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    } else if (e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    } else if (e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    } else if (e.target === tweetBtn){
        handleTweetBtnClick()
    } else if (e.target.dataset.comment){
        handleCommentClick(e.target.dataset.comment)
    } else if (e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }
})

function handleTweetBtnClick(){
    const textInput = document.getElementById('text-input')
    if (textInput){
      let newTweet = ''
                newTweet = {
                    handle: `@Akuaku`,
                    profilePic: `https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTkcQBCfmquldY44cEnx29Uyy7ZiVOl3OSh2MEw2c-GyQK2acTp`,
                    likes: 0,
                    retweets: 0,
                    tweetText: textInput.value,
                    replies: [],
                    isLiked: false,
                    isRetweeted: false,
                    uuid: uuidv4(),
                }
                tweetsData.unshift(newTweet)
                textInput.value = ''  
            }
    render()
}

function handleDeleteClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    const position = tweetsData.indexOf(targetTweetObj)
    tweetsData.splice(position, 1)
    render()
}

function handleCommentClick(tweetId){
    const commentInput = document.getElementById(`comment-input-${tweetId}`)
     const targetTweetObj = tweetsData.filter(function(tweet){
         return tweet.uuid === tweetId
     })[0]
     if (commentInput){
         let newComment = {
                handle: `@Akuaku`,
                profilePic: `https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTkcQBCfmquldY44cEnx29Uyy7ZiVOl3OSh2MEw2c-GyQK2acTp`,
                tweetText: commentInput.value,
            }
        targetTweetObj.replies.push(newComment)
        render()
     }
}

function handleReplyClick(tweetId){
    document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    if (targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    } else {
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()
}

function handleLikeClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    } else {
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function buildHtml(){
    let feedHtml = ``
    tweetsData.forEach(function(tweet){
        let heartClass = ''  
        let retweetClass = ''      
        if(tweet.isLiked){
            heartClass = 'liked'
        }
        if (tweet.isRetweeted){
            retweetClass = 'retweeted'
        }
let repliesHtml = ``        
tweet.replies.forEach(function(reply){
    repliesHtml += `<div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                        </div>`
})

        
        
feedHtml += `<div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <div class="tweet-top">
                            <p class="handle">${tweet.handle}</p>
                            <i class="fa-solid fa-trash" data-delete="${tweet.uuid}"></i>
                        </div>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular 
                                            fa-comment-dots"
                                            data-reply="${tweet.uuid}"></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid 
                                            fa-heart
                                            ${heartClass}" 
                                            data-like="${tweet.uuid}"></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid 
                                            fa-retweet
                                            ${retweetClass}" 
                                            data-retweet="${tweet.uuid}"></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div id="replies-${tweet.uuid}" class="hidden">
                    ${repliesHtml}
                    <div class="comment-container">
                        <input class="comment-input" 
                                        id="comment-input-${tweet.uuid}" 
                                        type="text" 
                                        placeholder="Type here your comment">
                                        </input>
                        <button class="comment-btn" data-comment="${tweet.uuid}">Post</button>
                    </div>
                </div> 
            </div>
            `
    })
    return feedHtml
}

function render(){
    document.getElementById('feed').innerHTML = buildHtml()
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
}

render()