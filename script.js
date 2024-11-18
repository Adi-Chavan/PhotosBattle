document.addEventListener('alpine:init', () => {
    Alpine.data('photoBattle', () => ({
        battleCount: 1,
        photos: [],
        leftImage: null,
        rightImage: null,
        loading: true,
        error: null,
        
        async init() {
            await this.fetchPhotos();
            await this.loadInitialPhotos();
        },

        async fetchPhotos() {
            try {
                const response = await fetch('https://picsum.photos/v2/list?page=2&limit=100');
                if (!response.ok) throw new Error('Failed to fetch photos');
                this.photos = await response.json();
            } catch (error) {
                this.error = 'Failed to load photos. Please refresh the page.';
                console.error('Error:', error);
            }
        },

        getRandomPhoto() {
            const randomIndex = Math.floor(Math.random() * this.photos.length);
            return this.photos[randomIndex];
        },

        async loadInitialPhotos() {
            this.loading = true;
            this.leftImage = this.getRandomPhoto();
            do {
                this.rightImage = this.getRandomPhoto();
            } while (this.rightImage.id === this.leftImage.id);
            this.loading = false;
        },

        async selectWinner(side) {
            if (this.loading) return;
            
            this.loading = true;
            this.battleCount++;

            const winner = side === 'left' ? this.leftImage : this.rightImage;
            let newPhoto;
            
            do {
                newPhoto = this.getRandomPhoto();
            } while (newPhoto.id === winner.id);

            if (side === 'left') {
                this.rightImage = newPhoto;
            } else {
                this.leftImage = newPhoto;
            }

            setTimeout(() => {
                this.loading = false;
            }, 300);
        }
    }));
});