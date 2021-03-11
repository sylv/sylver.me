function getElement() {
  return document.querySelector('#content')
}

function formatContent(content) {
  let lower = content.toLowerCase().trim()
  if (!lower.endsWith('.')) lower += '.'
  return lower + ' '
}

async function setContent() {
  const element = getElement()
  element.textContent = 'loading'
  return (
    fetch('https://www.reddit.com/r/Showerthoughts.json?raw_json=1&limit=5')
      // some browsers (brave) will block the request for some stupid reason
      // and return an empty str, so we have to get the str and check if its empty to handle
      // it properly.
      .then((res) => res.json())
      .then((body) => {
        const posts = body.data.children.filter((p) => !p.data.pinned && !p.data.stickied)
        const post = posts[Math.floor(Math.random() * posts.length)]
        element.textContent = formatContent(post.data.title)

        // link back to the source post to partially explain what the fuck is going on
        // and partially to give the OP credit (even though let's be honest, most of the
        // time its stolen in the first place)
        const link = document.createElement('a')
        link.href = post.data.url
        link.target = '_blank'
        link.innerText = post.data.author.toLowerCase()
        element.appendChild(link)
      })
  )
}

setContent().catch((e) => {
  console.error(e)
  element.textContent = 'something went wrong :('
})
