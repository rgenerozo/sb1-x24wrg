import { Observable } from '@nativescript/core';
import { Youtube } from '@nativescript/youtube';
import { Cast } from 'nativescript-cast';

export class MainViewModel extends Observable {
    private youtube: Youtube;
    private cast: Cast;
    
    searchQuery: string = '';
    searchResults: any[] = [];
    isPlaying: boolean = false;
    currentVideo: any = null;

    constructor() {
        super();
        this.youtube = new Youtube();
        this.cast = new Cast();
        this.cast.initialize();
    }

    async onSearch() {
        if (!this.searchQuery) return;

        try {
            const results = await this.youtube.search(this.searchQuery);
            this.set('searchResults', results.map(video => ({
                id: video.id,
                title: video.title,
                thumbnail: video.thumbnail,
                channel: video.channelTitle,
                videoUrl: `https://www.youtube.com/watch?v=${video.id}`
            })));
        } catch (error) {
            console.error('Erro na busca:', error);
        }
    }

    onVideoSelect(args: any) {
        const video = this.searchResults[args.index];
        this.set('currentVideo', video);
        this.set('isPlaying', true);
    }

    async connectToTV() {
        if (!this.currentVideo) return;

        try {
            const devices = await this.cast.getAvailableDevices();
            if (devices.length > 0) {
                await this.cast.connect(devices[0]);
                await this.cast.play(this.currentVideo.videoUrl);
            } else {
                console.log('Nenhum dispositivo encontrado');
            }
        } catch (error) {
            console.error('Erro ao conectar à TV:', error);
        }
    }
}