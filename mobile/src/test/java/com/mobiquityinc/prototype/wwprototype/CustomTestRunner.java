package com.mobiquityinc.prototype.wwprototype;

import org.junit.runners.model.InitializationError;
import org.robolectric.AndroidManifest;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;
import org.robolectric.res.Fs;

public class CustomTestRunner extends RobolectricTestRunner {

    public CustomTestRunner(Class<?> testClass) throws InitializationError {
        super(testClass);
    }

    @Override
    protected AndroidManifest getAppManifest(Config config) {
        String myAppPath = "./src/main";
        String manifestPath = myAppPath + "/AndroidManifest.xml";
        String resPath = myAppPath + "/res";
        String assetPath = myAppPath + "/assets";
        return createAppManifest(Fs.fileFromPath(manifestPath), Fs.fileFromPath(resPath), Fs.fileFromPath(assetPath));
    }

}
