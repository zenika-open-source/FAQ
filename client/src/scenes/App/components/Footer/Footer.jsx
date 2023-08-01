const Footer = () => (
  <footer className="h-[30px] flex items-center justify-evenly">
    <a href="https://www.algolia.com" target="_blank" rel="noopener noreferrer">
      <img src="/img/brands/powered-by-algolia.svg" alt="Powered by Algolia" />
    </a>
    <span className="flex items-center">
      <i className="material-icons text-[20px] pt-px mr-[4px]">mail</i>
      <a href={`mailto:contact@${import.meta.env.VITE_FAQ_URL}`}>
        contact@{import.meta.env.VITE_FAQ_URL}
      </a>
    </span>
  </footer>
)

export default Footer
