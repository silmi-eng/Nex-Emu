const SAMPLE_COUNT = 4*1024;
var audio_ctx = null;

const audio = {
    AUDIO_BUFFERING: 256,
    SAMPLE_MASK: SAMPLE_COUNT - 1,
    audio_samples_L: new Float32Array(SAMPLE_COUNT),
    audio_samples_R: new Float32Array(SAMPLE_COUNT),
    audio_write_cursor: 0, 
    audio_read_cursor: 0,
    setup: () => {
        if (localStorage.getItem('audio_enabled') === 'true' && !audio_ctx) {
            console.log('setup');
            
            audio_ctx = new (window.AudioContext || window.webkitAudioContext)();

            if (audio_ctx.state === 'suspended') {
                audio_ctx.resume().catch(err => console.error('Erro ao retomar áudio:', err));
            }

            var script_processor = audio_ctx.createScriptProcessor(audio.AUDIO_BUFFERING, 0, 2);
            script_processor.onaudioprocess = audio.audio_callback;
            script_processor.connect(audio_ctx.destination);
        }
    },
    filter: (samples, alpha = .8) => {
        let filteredSamples = [];
        let lastLeft = 0, lastRight = 0;

        for (let i = 0; i < samples.length; i++) {
            let { left, right } = samples[i];
    
            left = alpha * left + (1 - alpha) * lastLeft;
            right = alpha * right + (1 - alpha) * lastRight;
    
            filteredSamples.push({ left, right });
    
            lastLeft = left;
            lastRight = right;
        }
    
        return filteredSamples;
    },
    play: (samples) => {
        samples = audio.filter(samples);

        for (let i = 0; i < samples.length; i++) {
            let { left, right } = samples[i];

            audio.audio_samples_L[audio.audio_write_cursor] = left;
            audio.audio_samples_R[audio.audio_write_cursor] = right;
            audio.audio_write_cursor = (audio.audio_write_cursor + 1) & audio.SAMPLE_MASK;
        }
    },
    audio_callback: (event) => {
        var dst = event.outputBuffer;
        var len = dst.length;
        
        var dst_l = dst.getChannelData(0);
        var dst_r = dst.getChannelData(1);

        for(var i = 0; i < len; i++){
            var src_idx = (audio.audio_read_cursor + i) & audio.SAMPLE_MASK;
            
            if (audio.audio_read_cursor === audio.audio_write_cursor) {
                dst_l[i] = 0;
                dst_r[i] = 0;
            } else {
                dst_l[i] = audio.audio_samples_L[src_idx];
                dst_r[i] = audio.audio_samples_R[src_idx];
            }
        }
        
        audio.audio_read_cursor = (audio.audio_read_cursor + len) & audio.SAMPLE_MASK;
    },
};