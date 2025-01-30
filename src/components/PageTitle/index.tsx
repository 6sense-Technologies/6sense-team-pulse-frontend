const PageTitle = ({ pageName, title }: { pageName?: string, title: string }): JSX.Element => {
    return (
        <title>{pageName ? `${pageName} - ${title}` : title}</title>
    )
}

export default PageTitle