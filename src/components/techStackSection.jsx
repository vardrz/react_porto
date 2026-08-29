export default function TechStack(){
    const techIcons = [
        {name: 'PHP', icon: 'PHP.svg'},
        {name: 'Laravel', icon: 'Laravel.svg'},
        {name: 'Livewire', icon: 'Livewire.svg'},
        {name: 'CodeIgniter', icon: 'CodeIgniter.svg'},
        {name: 'JavaScript', icon: 'JavaScript.svg'},
        {name: 'Node.js', icon: 'Node.js.svg'},
        {name: 'React', icon: 'React.svg'},
        {name: 'Flutter', icon: 'Flutter.svg'},
        {name: 'Arduino', icon: 'Arduino.svg'},
        {name: 'Tailwind', icon: 'Tailwind CSS.svg'},
        {name: 'AntDesign', icon: 'Ant Design.svg'},
        {name: 'MySQL', icon: 'MySQL.svg'},
        {name: 'PostgresSQL', icon: 'PostgresSQL.svg'},
        {name: 'Firebase', icon: 'Firebase.svg'},
        {name: 'Figma', icon: 'Figma.svg'},
        {name: 'Postman', icon: 'Postman.svg'},
        {name: 'Git', icon: 'Git.svg'},
        {name: 'GitHub', icon: 'GitHub.svg'},
        {name: 'Windows', icon: 'Windows 8.svg'},
        {name: 'Ubuntu', icon: 'Ubuntu.svg'},
    ]

    return (
        <>
            <div className="w-full px-6 md:px-10 max-w-6xl mx-auto mt-24 mb-24">
                <div className="text-xs tracking-[0.2em] uppercase text-light/40 mb-6">Tech Stack</div>
                <div className="flex flex-wrap gap-2">
                    {techIcons.map((item, index) => (
                        <span key={index} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-xs tracking-wide text-light/70 hover:border-white/20 transition">
                            <img className="w-4 h-4" src={"tech-icons/" + item.icon}/>{item.name}
                        </span>
                    ))}
                </div>
                <div className="hidden md:block mt-8 text-5xl tracking-tight hero-text text-light/40">Tools I use daily</div>
            </div>
        </>
    )
}