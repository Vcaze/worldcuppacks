import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white mt-20">
      <div className="max-w-[120rem] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <h3 className="text-2xl font-heading text-primary mb-4">Football Pack Opener</h3>
            <p className="text-base text-foreground/70 font-paragraph">
              Experience the thrill of opening football player packs and collecting your favorite Champions League stars!
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-heading text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-base text-foreground/70 hover:text-primary transition-colors duration-300">
                  Home
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-heading text-foreground mb-4">About</h4>
            <p className="text-base text-foreground/70 font-paragraph">
              Collect rare and legendary player cards from the best teams in the Champions League. New packs every 2 minutes!
            </p>
          </div>
        </div>
        
        <div className="border-t border-foreground/10 pt-8">
          <p className="text-center text-base text-foreground/70 font-paragraph flex items-center justify-center gap-2">
            Made with <Heart className="w-5 h-5 text-primary fill-primary" /> for football fans
          </p>
        </div>
      </div>
    </footer>
  );
}
