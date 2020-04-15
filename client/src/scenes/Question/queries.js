import { useQuery, gql } from '@apollo/client'

export const nodeFragment = `
  id
  question {
    id
    title
    slug
    views
    user {
      id
      name
      picture
    }
    createdAt
  }
  answer {
    id
    content
    sources {
      label
      url
    }
    user {
      id
      name
      picture
    }
    createdAt
  }
  tags {
    id
    label {
      id
      name
    }
    user {
      id
      name
    }
    createdAt
  }
  flags {
    id
    type
    user {
      id
      name
    }
    createdAt
  }
`

export const useNode = (slugid, options) => {
  const id = slugid.split('-').pop()

  return useQuery(
    gql`
  query ($id: String!) {
    node (id: $id) {
      ${nodeFragment}
    }
  }
`,
    {
      variables: { id },
      returnPartialData: true,
      ...options
    }
  )
}
