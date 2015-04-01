package com.mobiquityinc.prototype.wwprototype;

import org.junit.runners.model.InitializationError;
import org.robolectric.RobolectricGradleTestRunner;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;
import org.robolectric.manifest.AndroidManifest;
import org.robolectric.res.Fs;

public class CustomTestRunner extends RobolectricGradleTestRunner {

    private static final int MAX_SDK_SUPPORTED_BY_ROBOLECTRIC = 21;

    public CustomTestRunner(Class<?> testClass) throws InitializationError {
        super(testClass);
    }

    @Override
    protected AndroidManifest getAppManifest(Config config) {
        
        String myAppPath = "./src/main";
        String manifestPath = myAppPath + "/AndroidManifest.xml";
        String resPath = myAppPath + "/res";
        String assetPath = myAppPath + "/assets";
        AndroidManifest manifest = new AndroidManifest(Fs.fileFromPath(manifestPath),
                Fs.fileFromPath(resPath),
                Fs.fileFromPath(assetPath)) {
            @Override
            public int getTargetSdkVersion() {
                return MAX_SDK_SUPPORTED_BY_ROBOLECTRIC;
            }
        };
        manifest.setPackageName("com.mobiquityinc.prototype.wwprototype");
        return manifest;
        /*
        return new AndroidManifest(manifest.getAndroidManifestFile(),
                manifest.getResDirectory(),
                manifest.getAssetsDirectory()) {
            @Override
            public int getTargetSdkVersion() {
                return MAX_SDK_SUPPORTED_BY_ROBOLECTRIC;
            }

        };*/
    }



}
