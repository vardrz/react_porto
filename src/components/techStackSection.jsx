/* eslint-disable react/prop-types */
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
            <div className="w-full px-6 md:px-10 max-w-6xl mx-auto mt-32 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="w-full lg:p-5">
                        <div className="md:hidden w-full mb-12 flex flex-col text-center">
                            <span className="hero-text text-5xl sm:text-7xl text-primary">Tech Stack </span>
                            <span className="hero-text text-4xl sm:text-5xl text-light">that I used</span>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">

                            {
                                techIcons.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center gap-2 p-3 bg-dark2/50 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-dark2 transition duration-200">
                                        <img className="w-8 h-8" src={"tech-icons/" + item.icon}/>
                                        <span className="text-light/70 text-[11px] tracking-wide">{item.name}</span>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                    <div className="hidden md:block w-full pl-14 lg:self-center">
                        <span className="hero-text text-7xl lg:text-6xl tracking-tight text-primary">Tech Stack </span>
                        <span className="hero-text text-5xl lg:text-7xl tracking-tight text-light">that I used</span>
                    </div>
                </div>
            </div>
        </>
    )
}