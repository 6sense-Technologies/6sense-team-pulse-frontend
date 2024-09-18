const PageTitle = ({ pageName, title }: { pageName: string, title: string }): JSX.Element => {
    return (
        <title>{`${pageName} - ${title}`}</title>
    )
}

export default PageTitle