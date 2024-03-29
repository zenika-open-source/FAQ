import { gql } from '@apollo/client'

export const zNodeFragment = `
  id
  question {
    id
    title
    language
    translation {
      id
      language
      text
    }
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
    language
    certified
    translation {
      language
      text
    }
    sources {
      id
      label
      url
    }
    user {
      id
      name
      picture
      specialties {
        name
      }
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
  tags {
    id
    label {
      id
      name
    }
  }
  history {
    id
    meta
    action
    model
  }
`

export const GET_NODE = gql`
  query getNode($id: ID!) {
    zNode(where: { id: $id }) {
      ${zNodeFragment}
    }
  }
`
