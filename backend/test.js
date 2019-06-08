const { prisma } = require('./prisma/generated/prisma-client')

const posts = prisma.user({ id: 'cjwlpf4q8t7860b127oqayz1m' }).posts() /*? */

console.log(posts.costs) /*? */
