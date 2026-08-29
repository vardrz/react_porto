export default function TechStack(){
    const techIcons = [
        {name: 'Go', icon: 'Go.svg'},
        {name: 'PHP', icon: 'PHP.svg'},
        {name: 'Laravel', icon: 'Laravel.svg'},
        {name: 'Livewire', icon: 'Livewire.svg'},
        {name: 'CodeIgniter', icon: 'CodeIgniter.svg'},
        {name: 'JavaScript', icon: 'JavaScript.svg'},
        {name: 'Node.js', icon: 'Node.js.svg'},
        {name: 'React', icon: 'React.svg'},
        {name: 'Flutter', icon: 'Flutter.svg'},
        {name: 'Tailwind', icon: 'Tailwind CSS.svg'},
        {name: 'AntDesign', icon: 'Ant Design.svg'},
        {name: 'MySQL', icon: 'MySQL.svg'},
        {name: 'PostgresSQL', icon: 'PostgresSQL.svg'},
        {name: 'Firebase', icon: 'Firebase.svg'},
        {name: 'Figma', icon: 'Figma.svg'},
        {name: 'Postman', icon: 'Postman.svg'},
        {name: 'Git', icon: 'Git.svg'},
        {name: 'GitHub', icon: 'GitHub.svg'},
        {name: 'Docker', icon: 'Docker.svg'},
        {name: 'Proxmox', icon: 'Proxmox.svg'},
        {name: 'Cloudflared', icon: 'Cloudflared.svg'},
        {name: 'Linux', icon: 'Linux.svg'},
    ]

    return (
        <>
            <div className="w-full px-6 md:px-10 max-w-6xl mx-auto mt-24 mb-24">
                <div className="text-xs tracking-[0.2em] uppercase text-light/40 mb-6">Tech Stack</div>
                <div className="flex flex-wrap gap-2">
                    {techIcons.map((item, index) => (
                        <span key={index} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-secondary/20 bg-dark2/40 text-xs tracking-wide text-light/70 hover:border-primary/30 transition">
                            <img className="w-4 h-4" src={"tech-icons/" + item.icon}/>{item.name}
                        </span>
                    ))}
                </div>
                <div className="hidden md:block mt-8 text-5xl tracking-tight hero-text text-light/40">Tools I use daily</div>
            </div>
        </>
    )
}
