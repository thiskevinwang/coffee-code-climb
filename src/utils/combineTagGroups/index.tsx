/**
 * Helper to combine markdownRemark & contentfulBlogPost Tags, alphbetically, and sum their totalCount
 *
 * Returns an array of Group (which is the same shape as both args)
 **/

interface Group {
  fieldValue: string
  totalCount: number
}

export const combineTagGroups = (
  markdownRemarkGroup: Array<Group>,
  contentfulBlogPostGroup: Array<Group>
) => {
  let result: Array<Group> = []

  // This avoids mutating inputs
  let group1: Array<Group> = new Array(...markdownRemarkGroup)
  let group2: Array<Group> = new Array(...contentfulBlogPostGroup)

  while (group1.length !== 0 && group2.length !== 0) {
    if (group1[0].fieldValue === group2[0].fieldValue) {
      result.push({
        fieldValue: group1[0].fieldValue,
        totalCount: group1[0].totalCount + group2[0].totalCount,
      })
      group1.shift()
      group2.shift()
    } else if (group1[0].fieldValue < group2[0].fieldValue) {
      result.push(group1.shift())
    } else {
      result.push(group2.shift())
    }
  }
  if (group1.length === 0 && group2.length !== 0) {
    result.push(...group2)
  } else if (group2.length === 0 && group1.length !== 0) {
    result.push(...group1)
  }

  return result
}
